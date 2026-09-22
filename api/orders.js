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
    // GET USER ORDERS
    // =========================
    if (req.method === "GET") {
      const orders = await supabaseRequest(
        `orders?user_id=eq.${encodeURIComponent(
          user.id
        )}&select=*&order=created_at.desc`
      );

      return send(res, 200, {
        success: true,
        orders: orders || []
      });
    }

    // =========================
    // CREATE ORDER
    // =========================
    if (req.method === "POST") {
      const body = await readBody(req);

      const {
        orderId,
        customer,
        paymentMethod,
        items,
        total
      } = body;

      if (!orderId || !customer || !items || total === undefined) {
        return send(res, 400, {
          success: false,
          message: "Missing order details."
        });
      }

      const order = {
        user_id: user.id,
        order_id: String(orderId),
        customer_name: String(customer.name || ""),
        mobile: String(customer.mobile || ""),
        email: String(customer.email || ""),
        address: String(customer.address || ""),
        city: String(customer.city || ""),
        state: String(customer.state || ""),
        pincode: String(customer.pincode || ""),
        payment_method: String(paymentMethod || ""),
        items: items,
        total: Number(total),
        status: "Placed"
      };

      const created = await supabaseRequest("orders", {
        method: "POST",
        headers: {
          Prefer: "return=representation"
        },
        body: JSON.stringify(order)
      });

      return send(res, 201, {
        success: true,
        message: "Order placed successfully.",
        order: created && created.length
          ? created[0]
          : order
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
      message: "Order server error.",
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