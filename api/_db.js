import crypto from 'node:crypto';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function dbReady() { return Boolean(url && key); }

export async function dbRequest(path, options = {}) {
  if (!dbReady()) throw new Error('Supabase environment variables are not configured.');
  const res = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const text = await res.text();
  let data = null; try { data = text ? JSON.parse(text) : null; } catch {}
  if (!res.ok) throw new Error(data?.message || data?.error || text || 'Database request failed');
  return data;
}

export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}
export function verifyPassword(password, stored) {
  const [salt, expected] = String(stored || '').split(':');
  if (!salt || !expected) return false;
  const actual = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(expected, 'hex'));
}
export function token() { return crypto.randomBytes(32).toString('hex'); }
export function cookie(name, value, maxAge = 60 * 60 * 24 * 30) {
  return `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}
export function getToken(req) {
  const raw = req.headers.cookie || '';
  const found = raw.split(';').map(x => x.trim()).find(x => x.startsWith('cfx_session='));
  return found ? decodeURIComponent(found.split('=').slice(1).join('=')) : null;
}
export async function currentUser(req) {
  const t = getToken(req);
  if (!t) return null;
  const rows = await dbRequest(`sessions?token=eq.${encodeURIComponent(t)}&select=user_id,expires_at,users(id,name,email,mobile)&limit=1`);
  const row = rows?.[0];
  if (!row || new Date(row.expires_at) < new Date()) return null;
  return row.users;
}
export function send(res, status, body, extraHeaders = {}) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  Object.entries(extraHeaders).forEach(([k,v]) => res.setHeader(k,v));
  res.end(JSON.stringify(body));
}
