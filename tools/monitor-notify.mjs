import { readFile, rename, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const env = process.env;
const repo = env.GITHUB_REPOSITORY;
const runId = env.GITHUB_RUN_ID;
const runUrl = 'https://github.com/' + repo + '/actions/runs/' + runId;
const stateFile = 'journey-alert-state.json';
const runnerName = 'Execução do monitor';

async function readState() {
  try {
    const state = JSON.parse(await readFile(stateFile, 'utf8'));
    if (state.version !== 1 || !Array.isArray(state.open) ||
      state.open.some(item => typeof item.name !== 'string' || !/^[0-9]+$/.test(item.run))) {
      throw new Error('Formato inesperado do estado de alertas.');
    }
    return state;
  } catch (error) {
    if (error.code === 'ENOENT') return {version: 1, open: []};
    throw error;
  }
}

async function saveState(state) {
  await writeFile(stateFile + '.tmp', JSON.stringify(state), 'utf8');
  await rename(stateFile + '.tmp', stateFile);
}

async function results() {
  try {
    const rows = JSON.parse(await readFile('journey-results.json', 'utf8'));
    if (!Array.isArray(rows) || rows.length !== 3 ||
      rows.some(row => !row || typeof row.name !== 'string' || !row.name.trim() ||
          row.name.length > 100 || /[\r\n]/.test(row.name) || typeof row.ok !== 'boolean') ||
      new Set(rows.map(row => row.name)).size !== rows.length) throw new Error();
    return rows;
  } catch {
    return [{ name: runnerName, ok: false, detail: 'O executor não produziu os três resultados esperados.' }];
  }
}

async function email(key, subject, text) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + env.MONITOR_MAIL_KEY,
      'Content-Type': 'application/json',
      'Idempotency-Key': 'journeys/' + key
    },
    body: JSON.stringify({from: env.MONITOR_MAIL_FROM, to: [env.MONITOR_MAIL_TO], subject, text}),
    signal: AbortSignal.timeout(15000)
  });
  if (!response.ok) throw new Error('Resend HTTP ' + response.status);
  const result = await response.json();
  if (!result.id) throw new Error('Resend não informou o identificador.');
  console.log('E-mail aceito pelo Resend: ' + result.id);
}

async function main() {
  for (const key of ['GITHUB_REPOSITORY','GITHUB_RUN_ID','MONITOR_MAIL_FROM','MONITOR_MAIL_TO','MONITOR_MAIL_KEY']) {
    if (!env[key]) throw new Error('Configuração ausente: ' + key);
  }
  const rows = await results();
  const failed = rows.filter(row => !row.ok);
  if (env.MONITOR_DRILL === '1') {
    const summary = rows.map(row => (row.ok ? 'OK' : 'Falhou') + ' · ' + row.name).join('\n');
    await email(runId + '/simulacao', '[Teste de alerta] Monitor do Caos Domado',
      'Pedro, este é um exercício do monitor.\n\n' + summary + '\n\nVer a execução: ' + runUrl);
    return;
  }
  const state = await readState();
  const errors = [];
  for (const row of rows) {
    if (row.ok || state.open.some(item => item.name === row.name)) continue;
    const fingerprint = createHash('sha256').update(row.name).digest('hex').slice(0,16);
    try {
      await email(runId + '/' + fingerprint + '/falha', 'Falha no site · ' + row.name,
        'O monitor detectou uma falha no percurso “' + row.name + '”.\n\nVer a execução: ' + runUrl);
      state.open.push({name: row.name, run: runId, fingerprint});
      await saveState(state);
    } catch (error) { errors.push(error.message); }
  }
  for (const incident of [...state.open]) {
    const recovered = rows.some(row => row.name === incident.name && row.ok) ||
      (incident.name === runnerName && rows.length === 3);
    if (!recovered) continue;
    try {
      await email(incident.run + '/' + incident.fingerprint + '/recuperado', 'Recuperado · ' + incident.name,
        'O percurso “' + incident.name + '” voltou a passar.\n\nPrimeira falha: https://github.com/' +
        repo + '/actions/runs/' + incident.run);
      state.open = state.open.filter(item => item !== incident);
      await saveState(state);
    } catch (error) { errors.push(error.message); }
  }
  await saveState(state);
  if (errors.length) throw new Error(errors.join(' | '));
  console.log(failed.length + ' percurso(s) com falha.');
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
