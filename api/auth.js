const {
  supabaseRequest,
  hashPassword,
  verifyPassword,
  createToken,
  setSessionCookie,
  getCurrentUser,
  send
} = require("./db");

module.exports = async (req, res) => {
  try {
    const method = req.method;
    const url = new URL(
      req.url,
      `http://${req.headers.host || "localhost"}`
    );

    const action = url.searchParams.get("action");

    // ==============================
    // GET CURRENT USER
    // /api/auth?action=me
    // ==============================
    if (method === "GET" && action === "me") {
      const user = await getCurrentUser(req);

      return send(res, 200, {
        authenticated: !!user,
        user: user || null
      });
    }

    // ==============================
    // LOGOUT
    // /api/auth?action=logout
    // ==============================
    if (method === "POST" && action === "logout") {
      const token = require("./db").getSessionToken(req);

      if (token) {
        await supabaseRequest(
          `sessions?token=eq.${encodeURIComponent(token)}`,
          {
            method: "DELETE"
          }
        );
      }

      return send(
        res,
        200,
        { success: true },
        {
          "Set-Cookie":
            "cfx_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"
        }
      );
    }

    // ==============================
    // REGISTER
    // /api/auth?action=register
    // ==============================
    if (method === "POST" && action === "register") {
      const body = await readBody(req);

      const name = String(body.name || "").trim();
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");

      if (!name || !email || !password) {
        return send(res, 400, {
          success: false,
          message: "Name, email and password are required."
        });
      }

      if (password.length < 6) {
        return send(res, 400, {
          success: false,
          message: "Password must be at least 6 characters."
        });
      }

      const existing = await supabaseRequest(
        `users?email=eq.${encodeURIComponent(email)}&select=id&limit=1`
      );

      if (existing && existing.length > 0) {
        return send(res, 409, {
          success: false,
          message: "Email already registered."
        });
      }

      const passwordHash = hashPassword(password);

      const created = await supabaseRequest("users", {
        method: "POST",
        headers: {
          Prefer: "return=representation"
        },
        body: JSON.stringify({
          name,
          email,
          password_hash: passwordHash
        })
      });

      const user = created[0];

      const token = createToken();

      const expiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toISOString();

      await supabaseRequest("sessions", {
        method: "POST",
        headers: {
          Prefer: "return=minimal"
        },
        body: JSON.stringify({
          user_id: user.id,
          token,
          expires_at: expiresAt
        })
      });

      return send(
        res,
        201,
        {
          success: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          }
        },
        {
          "Set-Cookie": setSessionCookie(token)
        }
      );
    }

    // ==============================
    // LOGIN
    // /api/auth?action=login
    // ==============================
    if (method === "POST" && action === "login") {
      const body = await readBody(req);

      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");

      if (!email || !password) {
        return send(res, 400, {
          success: false,
          message: "Email and password are required."
        });
      }

      const users = await supabaseRequest(
        `users?email=eq.${encodeURIComponent(email)}&select=id,name,email,password_hash&limit=1`
      );

      if (!users || users.length === 0) {
        return send(res, 401, {
          success: false,
          message: "Invalid email or password."
        });
      }

      const user = users[0];

      const valid = verifyPassword(
        password,
        user.password_hash
      );

      if (!valid) {
        return send(res, 401, {
          success: false,
          message: "Invalid email or password."
        });
      }

      const token = createToken();

      const expiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toISOString();

      await supabaseRequest("sessions", {
        method: "POST",
        headers: {
          Prefer: "return=minimal"
        },
        body: JSON.stringify({
          user_id: user.id,
          token,
          expires_at: expiresAt
        })
      });

      return send(
        res,
        200,
        {
          success: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          }
        },
        {
          "Set-Cookie": setSessionCookie(token)
        }
      );
    }

    return send(res, 404, {
      success: false,
      message: "Auth endpoint not found."
    });
  } catch (error) {
    console.error(error);

    return send(res, 500, {
      success: false,
      message: "Server error.",
      error: error.message
    });
  }
};

// ======================================
// READ JSON REQUEST BODY
// ======================================
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error("Invalid JSON request body."));
      }
    });

    req.on("error", reject);
  });
}