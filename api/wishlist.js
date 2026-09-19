const {
  supabaseRequest,
  getCurrentUser,
  send
} = require("./db");

module.exports = async (req, res) => {
  try {
    const user = await getCurrentUser(req);

    if (!user) {
      return send(res, 401, {
        success: false,
        message: "Please login first."
      });
    }

    // =========================
    // GET WISHLIST
    // =========================
    if (req.method === "GET") {
      const wishlist = await supabaseRequest(
        `wishlists?user_id=eq.${encodeURIComponent(
          user.id
        )}&select=*`
      );

      return send(res, 200, {
        success: true,
        wishlist: wishlist || []
      });
    }

    // =========================
    // ADD / REMOVE WISHLIST
    // =========================
    if (req.method === "POST") {
      const body = await readBody(req);

      const productId = String(body.productId || "").trim();

      if (!productId) {
        return send(res, 400, {
          success: false,
          message: "Product ID is required."
        });
      }

      const existing = await supabaseRequest(
        `wishlists?user_id=eq.${encodeURIComponent(
          user.id
        )}&product_id=eq.${encodeURIComponent(productId)}&select=id&limit=1`
      );

      // REMOVE FROM WISHLIST
      if (existing && existing.length > 0) {
        await supabaseRequest(
          `wishlists?id=eq.${encodeURIComponent(existing[0].id)}`,
          {
            method: "DELETE"
          }
        );

        return send(res, 200, {
          success: true,
          action: "removed",
          productId
        });
      }

      // ADD TO WISHLIST
      const created = await supabaseRequest("wishlists", {
        method: "POST",
        headers: {
          Prefer: "return=representation"
        },
        body: JSON.stringify({
          user_id: user.id,
          product_id: productId
        })
      });

      return send(res, 201, {
        success: true,
        action: "added",
        productId,
        wishlist: created || []
      });
    }

    return send(res, 405, {
      success: false,
      message: "Method not allowed."
    });

  } catch (error) {
    console.error(error);

    return send(res, 500, {
      success: false,
      message: "Wishlist server error.",
      error: error.message
    });
  }
};


// =========================
// READ JSON BODY
// =========================
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