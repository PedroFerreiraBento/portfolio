import { randomBytes } from 'node:crypto';
import { readFile, mkdir } from 'node:fs/promises';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { homedir } from 'node:os';
import { dirname, extname, join, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const app = resolve(root, 'app');
const require = createRequire(pathToFileURL(resolve(app, 'package.json')));
const { PGlite } = require('@electric-sql/pglite');
const port = Number(process.env.CRM_LOCAL_PORT || 4388);
const address = '127.0.0.1';
const host = address + ':' + port;
const fixturesEnabled = process.env.CRM_LOCAL_NO_SEED !== '1';
const admin = {
  id: '30000000-0000-4000-8000-000000000001', name: 'Pedro', role: 'admin',
  email: (process.env.CRM_LOCAL_ADMIN_EMAIL || 'pedro@crm.local').trim().toLowerCase(),
  password: process.env.CRM_LOCAL_ADMIN_PASSWORD || 'crm-local-pedro'
};
const demoMember = {
  id: '30000000-0000-4000-8000-000000000002', name: 'Marina', role: 'member',
  email: 'marina@crm.local', password: 'crm-local-marina'
};
const dataDir = process.env.CRM_LOCAL_DATA_DIR ||
  join(process.env.LOCALAPPDATA || homedir(), 'CaosDomado', 'CRM-local', 'pgdata');

const contentTypes = {
  '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml', '.webp':'image/webp',
  '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.gif':'image/gif',
  '.ico':'image/x-icon', '.ttf':'font/ttf', '.woff':'font/woff', '.woff2':'font/woff2',
  '.json':'application/json; charset=utf-8', '.txt':'text/plain; charset=utf-8'
};
const publicRootFiles = new Set(['index.html', 'contato.html', 'catalogo-online.html', 'guias.html', 'pagina-de-orcamentos.html', 'agendamento-online.html', 'styles.css', 'app.js', 'favicon.ico']);
const publicFolders = new Set(['assets', 'crm', 'demos', 'guia']);
const migrations = [
  'crm-runtime-role.sql', 'crm-intake-followup.sql', 'crm-funnel.sql',
  'crm-notifications.sql', 'crm-operations.sql', 'crm-today-experiments.sql',
  'crm-team.sql', 'crm-team-assignment.sql', 'crm-clients.sql', 'crm-pipeline.sql', 'crm-attribution-deposits.sql', 'crm-visit-pages.sql', 'crm-gallery.sql'
];

class RequestError extends Error {
  constructor(status) {
    super('Request could not be completed');
    this.status = status;
  }
}

async function loadJson(req) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size <= 12000) chunks.push(chunk);
  }
  if (size > 12000) throw new RequestError(413);
  if (size === 0) return undefined;
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new RequestError(400);
  }
}

function serveApi(req, res, url, handler) {
  res.status = code => { res.statusCode = code; return res; };
  res.json = data => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(data));
  };
  req.query = Object.fromEntries(url.searchParams);
  return loadJson(req).then(body => {
    req.body = body;
    return handler(req, res);
  });
}

function publicFile(pathname) {
  if (['/catalogo-online', '/guias', '/pagina-de-orcamentos', '/agendamento-online', '/guia/catalogo-para-orcamentos-no-whatsapp', '/guia/pagina-para-orcamentos-no-whatsapp', '/guia/pagina-de-agendamento-online'].includes(pathname)) pathname += '.html';
  const normalized = pathname === '/crm' ? '/crm/index.html' :
    pathname.endsWith('/') ? pathname + 'index.html' : pathname;
  const parts = normalized.slice(1).split('/');
  if (parts.some(part => part === '.' || part === '..' || part.startsWith('.') || part.includes('\\'))) return null;
  const file = resolve(app, ...parts);
  if (!file.startsWith(app + sep) || !contentTypes[extname(file)]) return null;
  if (parts.length === 1 ? !publicRootFiles.has(parts[0]) : !publicFolders.has(parts[0])) return null;
  return file;
}

async function bootstrap(db) {
  await db.exec(await readFile(resolve(root, 'docs/crm-schema.sql'), 'utf8'));
  await db.exec("DO $$ BEGIN " +
    "IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='crm_runtime') THEN CREATE ROLE crm_runtime; END IF; " +
    "IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='crm_preview_runtime') THEN CREATE ROLE crm_preview_runtime; END IF; END $$;");
  for (const migration of migrations) {
    await db.exec(await readFile(resolve(root, 'docs', migration), 'utf8'));
  }
  const { hashPassword } = await import(pathToFileURL(resolve(app, 'lib/crm-team.js')));
  for (const account of fixturesEnabled ? [admin, demoMember] : [admin]) {
    const { rows } = await db.query('SELECT id FROM crm_preview.team_members WHERE id=$1', [account.id]);
    if (rows.length) continue;
    await db.query('INSERT INTO crm_preview.team_members (id,name,email,role,password_hash) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (id) DO NOTHING',
      [account.id, account.name, account.email, account.role, await hashPassword(account.password)]);
  }
  if (!fixturesEnabled) return;
  await db.exec('CREATE SCHEMA IF NOT EXISTS crm_local; CREATE TABLE IF NOT EXISTS crm_local.fixtures (version integer PRIMARY KEY)');
  const sampleFiles = [
    ['crm-local-fixtures.sql'],
    ['crm-today-performance-fixtures.sql', 'crm-today-experiments-fixtures.sql'],
    ['crm-local-team-fixtures.sql'],
    ['crm-local-clients-fixtures.sql'],
    ...((process.env.CRM_PIPELINE_ENABLED ?? '1') === '1' ? [['crm-local-pipeline-fixtures.sql']] : [])
  ];
  await db.transaction(async tx => {
    for (const [index, files] of sampleFiles.entries()) {
      const { rows } = await tx.query('INSERT INTO crm_local.fixtures VALUES ($1) ON CONFLICT DO NOTHING RETURNING version', [index+1]);
      if (!rows.length) continue;
      for (const file of files) await tx.exec(await readFile(resolve(root, 'tools', file), 'utf8'));
    }
  });
}

if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('CRM_LOCAL_PORT inválida.');

const server = createServer();
const listen = () => new Promise((done, reject) => {
  server.once('error', reject);
  server.listen(port, address, done);
});
await listen();
try {
  if (dataDir !== 'memory://') await mkdir(dirname(dataDir), {recursive:true});
  const db = await PGlite.create(dataDir);
  await bootstrap(db);
  await db.exec("SET ROLE crm_preview_runtime");

  // The browser uses the actual CRM API and a database private to this preview.
  delete process.env.VERCEL;
  process.env.VERCEL_ENV = 'development';
  process.env.CRM_DB_DATABASE_URL = 'local-only';
  process.env.CRM_TEAM_ENABLED = '1';
  process.env.CRM_CLIENTS_ENABLED = '1';
  process.env.CRM_PIPELINE_ENABLED ??= '1';
  process.env.CRM_SESSION_SECRET = randomBytes(32).toString('hex');
  const { makeHandler } = await import(pathToFileURL(resolve(app, 'api/crm.js')));
  const handler = makeHandler(() => ({
    query: async (...args) => (await db.query(...args)).rows
  }));

  server.on('request', async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-store');
    try {
      if (req.headers.host !== host && req.headers.host !== 'localhost:' + port) throw new RequestError(403);
      const url = new URL(req.url, 'http://' + host);
      if (url.pathname === '/api/crm') return await serveApi(req, res, url, handler);
      if (url.pathname === '/api/portfolio-events' && req.method === 'POST') {
        await loadJson(req);
        return res.writeHead(204).end();
      }
      if (!['GET','HEAD'].includes(req.method)) throw new RequestError(405);
      const path = publicFile(decodeURIComponent(url.pathname));
      if (!path) throw new RequestError(404);
      const content = await readFile(path);
      res.setHeader('Content-Type', contentTypes[extname(path)]);
      res.end(req.method === 'HEAD' ? undefined : content);
    } catch (error) {
      if (res.headersSent) return res.end();
      const status = error.status || (error.code === 'ENOENT' ? 404 : error instanceof URIError ? 400 : 500);
      res.writeHead(status, {'Content-Type':'application/json; charset=utf-8'});
      res.end(JSON.stringify({error: status >= 500 ? 'unavailable' : 'invalid'}));
      if (status >= 500) console.error('Falha no CRM local:', error.code || error.name);
    }
  });
  console.log('CRM local: http://' + host + '/crm');
  console.log('Contas de demonstração em docs/crm-local.md.');
  for (const signal of ['SIGINT','SIGTERM']) {
    process.once(signal, () => server.close(() => { void db.close(); }));
  }
} catch (error) {
  server.close();
  throw error;
}
