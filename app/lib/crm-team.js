import { createHash, randomBytes, randomUUID, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const passwordHash = promisify(scrypt);
const options = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const tokenPattern = /^[0-9a-f]{64}$/;
const hashPattern = /^[0-9a-f]{32}:[0-9a-f]{128}$/;
export const teamMemberId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const safeColumns = 'id,name,email,role,active';
const dummyHash = '0'.repeat(32) + ':' + '0'.repeat(128);
const digest = token => createHash('sha256').update(token).digest('hex');

function usablePassword(value, minimum = 12) {
  return typeof value === 'string' && value.length >= minimum && value.length <= 160 && !value.includes('\0');
}

function normalizedEmail(value) {
  if (typeof value !== 'string') return null;
  const email = value.toLowerCase().trim();
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !email.includes('\0') ? email : null;
}

function normalizedName(value) {
  const name = typeof value === 'string' ? value.trim() : '';
  return name.length >= 2 && name.length <= 120 && !name.includes('\0') ? name : null;
}

function actorFor(row) {
  return { id: row.id, name: row.name, email: row.email, role: row.role };
}

export async function hashPassword(password) {
  if (!usablePassword(password)) throw new Error('Invalid team password length');
  const salt = randomBytes(16);
  const checksum = await passwordHash(password, salt, 64, options);
  return salt.toString('hex') + ':' + checksum.toString('hex');
}

async function checkPassword(password, value) {
  if (!usablePassword(password, 1)) return false;
  const original = typeof value === 'string' && hashPattern.test(value) ? value : dummyHash;
  const [salt, expected] = original.split(':');
  const actual = await passwordHash(password, Buffer.from(salt, 'hex'), 64, options);
  return timingSafeEqual(actual, Buffer.from(expected, 'hex')) && original !== dummyHash;
}

export async function getTeamActor(sql, schema, token) {
  if (typeof token !== 'string' || !tokenPattern.test(token)) return null;
  const [row] = await sql.query('SELECT m.id,m.name,m.email,m.role FROM ' + schema + '.team_sessions s JOIN ' +
    schema + '.team_members m ON m.id=s.member_id AND m.session_version=s.member_version' +
    ' WHERE s.token_hash=$1 AND m.active AND s.expires_at>now()', [digest(token)]);
  return row ? actorFor(row) : null;
}

export async function loginTeam({sql, schema, data, sessionSeconds, setCookie, reply}) {
  const members = schema + '.team_members';
  const sessions = schema + '.team_sessions';
  const [member] = await sql.query('SELECT ' + safeColumns + ',password_hash,session_version FROM ' + members +
    ' WHERE email=$1', [normalizedEmail(data.email)]);
  const valid = await checkPassword(data.password, member?.password_hash);
  if (!valid || !member?.active) return reply(401, {error:'key'});
  const token = randomBytes(32).toString('hex');
  const [session] = await sql.query('WITH expired AS (DELETE FROM ' + sessions + ' WHERE expires_at<=now())' +
    ' INSERT INTO ' + sessions + ' (token_hash,member_id,member_version,expires_at)' +
    ' SELECT $1,id,session_version,now()+make_interval(secs=>$4) FROM ' + members +
    ' WHERE id=$2 AND session_version=$3 AND active RETURNING token_hash',
    [digest(token), member.id, member.session_version, sessionSeconds]);
  if (!session) return reply(401, {error:'key'});
  setCookie(token, sessionSeconds);
  return reply(200, {signedIn:true, team:true, actor:actorFor(member)});
}

export async function logoutTeam(sql, schema, token) {
  if (typeof token === 'string' && tokenPattern.test(token)) {
    await sql.query('DELETE FROM ' + schema + '.team_sessions WHERE token_hash=$1', [digest(token)]);
  }
}

export async function handleTeamDirectory({action, method, sql, schema, data, actor, reply, setCookie}) {
  const members = schema + '.team_members';
  if (action === 'password') {
    if (method !== 'POST') return reply(405, {error:'method'});
    if (!usablePassword(data.password) || data.currentPassword === data.password) return reply(400, {error:'invalid'});
    const [member] = await sql.query('SELECT password_hash FROM ' + members + ' WHERE id=$1 AND active', [actor.id]);
    if (!(await checkPassword(data.currentPassword, member?.password_hash))) return reply(401, {error:'key'});
    const next = await hashPassword(data.password);
    const [updated] = await sql.query('UPDATE ' + members + ' SET password_hash=$3,session_version=session_version+1' +
      ' WHERE id=$1 AND password_hash=$2 AND active RETURNING id', [actor.id, member.password_hash, next]);
    if (!updated) return reply(409, {error:'stale'});
    setCookie('', 0);
    return reply(200, {signedIn:false});
  }

  if (method === 'GET') {
    const params = actor.role === 'admin' ? [] : [actor.id];
    const rows = await sql.query('SELECT m.id,m.name,m.email,m.role,m.active,count(s.member_id)::int AS active_sessions' +
      ' FROM ' + members + ' m LEFT JOIN ' + schema + '.team_sessions s' +
      ' ON s.member_id=m.id AND s.member_version=m.session_version AND s.expires_at>now() AND m.active' +
      (params.length ? ' WHERE m.id=$1' : '') + ' GROUP BY m.id ORDER BY m.active DESC, m.name, m.email', params);
    return reply(200, {members:rows});
  }

  if (actor.role !== 'admin') return reply(403, {error:'forbidden'});
  if (method === 'POST') {
    const name = normalizedName(data.name);
    const email = normalizedEmail(data.email);
    if (!name || !email || !usablePassword(data.password)) return reply(400, {error:'invalid'});
    const [member] = await sql.query('INSERT INTO ' + members + ' (id,name,email,role,password_hash)' +
      " VALUES ($1,$2,$3,'member',$4) ON CONFLICT(email) DO NOTHING RETURNING " + safeColumns,
      [randomUUID(), name, email, await hashPassword(data.password)]);
    return member ? reply(201, {member:{...member,active_sessions:0}}) : reply(409, {error:'duplicate'});
  }

  if (method !== 'PATCH') return reply(405, {error:'method'});
  const toggle = Object.hasOwn(data,'active');
  const reset = Object.hasOwn(data,'password');
  const revoke = Object.hasOwn(data,'revokeSessions');
  if (typeof data.id !== 'string' || !teamMemberId.test(data.id) || (!toggle && !reset && !revoke) ||
      (revoke && (data.revokeSessions !== true || toggle || reset)) ||
      (toggle && typeof data.active !== 'boolean') || (reset && !usablePassword(data.password))) {
    return reply(400, {error:'invalid'});
  }
  const [member] = await sql.query('UPDATE ' + members + ' SET active=COALESCE($2,active),' +
    'password_hash=COALESCE($3,password_hash),session_version=session_version+1' +
    " WHERE id=$1 AND role='member' RETURNING " + safeColumns,
    [data.id, toggle ? data.active : null, reset ? await hashPassword(data.password) : null]);
  return member ? reply(200, {member:{...member,active_sessions:0}}) : reply(404, {error:'missing_member'});
}
