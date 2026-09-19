const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Supabase environment variables are missing.");
}

async function supabaseRequest(path, options = {}) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const text = await response.text();

  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    throw new Error(
      typeof data === "string"
        ? data
        : data?.message || JSON.stringify(data)
    );
  }

  return data;
}

function hashPassword(password) {
  const crypto = require("crypto");

  const salt = crypto.randomBytes(16).toString("hex");

  const hash = crypto
    .scryptSync(password, salt, 64)
    .toString("hex");

  return `${salt}:${hash}`;
}

function verifyPassword(password, storedPassword) {
  const crypto = require("crypto");

  const [salt, originalHash] = storedPassword.split(":");

  if (!salt || !originalHash) {
    return false;
  }

  const hash = crypto
    .scryptSync(password, salt, 64)
    .toString("hex");

  return crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(originalHash, "hex")
  );
}

function createToken() {
  const crypto = require("crypto");

  return crypto.randomBytes(32).toString("hex");
}

function setSessionCookie(token) {
  return `cfx_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`;
}

function getSessionToken(req) {
  const cookie = req.headers.cookie || "";

  const match = cookie.match(/(?:^|;\s*)cfx_session=([^;]+)/);

  return match ? match[1] : null;
}

async function getCurrentUser(req) {
  const token = getSessionToken(req);

  if (!token) {
    return null;
  }

  const sessions = await supabaseRequest(
    `sessions?token=eq.${encodeURIComponent(token)}&select=id,user_id,expires_at&limit=1`
  );

  if (!sessions || sessions.length === 0) {
    return null;
  }

  const session = sessions[0];

  if (new Date(session.expires_at) < new Date()) {
    return null;
  }

  const users = await supabaseRequest(
    `users?id=eq.${encodeURIComponent(session.user_id)}&select=id,name,email&limit=1`
  );

  return users && users.length ? users[0] : null;
}

function send(res, status, data, extraHeaders = {}) {
  res.statusCode = status;

  Object.entries(extraHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  res.setHeader("Content-Type", "application/json");

  res.end(JSON.stringify(data));
}

module.exports = {
  supabaseRequest,
  hashPassword,
  verifyPassword,
  createToken,
  setSessionCookie,
  getSessionToken,
  getCurrentUser,
  send
};