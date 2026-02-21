import express from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import cors from "cors";
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const app = express();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);



app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8080'
}))


// Basic CORS so the Vite dev server (default 5173) can call this API
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keyId || !keySecret) {
  // eslint-disable-next-line no-console
  console.warn(
    "[razorpay] RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not set in environment. " +
    "Create them in your shell or a process manager before starting this server."
  );
}

// Lazy load Razorpay so the file does not crash if the dependency is missing.
let razorpayInstance = null;

function getRazorpay() {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
  return razorpayInstance;
}

// Create Razorpay order
app.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt, notes } = req.body || {};

    if (!amount || Number.isNaN(Number(amount))) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const razorpay = getRazorpay();

    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100), // amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {},
    });

    return res.json(order);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[razorpay] Error creating order:", error);
    return res.status(500).json({ error: "Failed to create order" });
  }
});

// Verify payment signature
app.post("/verify-payment", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ valid: false, error: "Missing payment fields" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", keySecret || "")
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      return res.json({ valid: true });
    }

    return res.status(400).json({ valid: false, error: "Invalid signature" });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[razorpay] Error verifying payment:", error);
    return res.status(500).json({ valid: false, error: "Verification failed" });
  }
});

// Middleware to verify auth token
async function verifyAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Missing authorization header" });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

// Middleware to verify admin role
async function verifyAdmin(req, res, next) {
  try {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("user_id", req.user.id)
      .single();

    if (profile?.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    next();
  } catch (error) {
    return res.status(403).json({ error: "Access denied" });
  }
}

// Create an order record after successful payment
app.post("/orders", verifyAuth, async (req, res) => {
  try {
    const {
      orderId,
      paymentId,
      amount,
      items,
      shippingAddress,
      status = "completed"
    } = req.body;

    if (!orderId || !paymentId || !amount || !items) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          user_id: req.user.id,
          order_id: orderId,
          payment_id: paymentId,
          amount,
          items,
          shipping_address: shippingAddress,
          status,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ success: true, order: data[0] });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[orders] Error creating order:", error);
    return res.status(500).json({ error: "Failed to create order record" });
  }
});

// Get user's order history
app.get("/orders/user/history", verifyAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ orders: data });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[orders] Error fetching user orders:", error);
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Get single order details
app.get("/orders/:id", verifyAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", req.params.id)
      .eq("user_id", req.user.id)
      .single();

    if (error) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.json({ order: data });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[orders] Error fetching order:", error);
    return res.status(500).json({ error: "Failed to fetch order" });
  }
});

// Admin: Get all orders (paginated)
app.get("/admin/orders", verifyAuth, verifyAdmin, async (req, res) => {
  console.log("hit /admin/orders")
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const userId = req.query.userId;

    let query = supabase
      .from("orders")
      .select("*,user_profiles(email,name)", { count: "exact" });

    if (status) {
      query = query.eq("status", status);
    }

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({
      orders: data,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[admin] Error fetching orders:", error);
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Admin: Update order status
app.patch("/admin/orders/:id", verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const { data, error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", req.params.id)
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ success: true, order: data[0] });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[admin] Error updating order:", error);
    return res.status(500).json({ error: "Failed to update order" });
  }
});

// Admin: Get order statistics
app.get("/admin/orders/stats/overview", verifyAuth, verifyAdmin, async (req, res) => {
  console.log("hit")
  try {
    const { data: orders, error } = await supabase
      .from("orders")
      .select("status,amount");

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const stats = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.amount, 0),
      completedOrders: orders.filter(o => o.status === "completed").length,
      pendingOrders: orders.filter(o => o.status === "pending").length,
      failedOrders: orders.filter(o => o.status === "failed").length,
    };

    return res.json(stats);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[admin] Error fetching stats:", error);
    return res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

// Save onboarding profile
app.post("/onboarding/profile", verifyAuth, async (req, res) => {
  try {
    const { name, phone, address_street, address_city, address_state, address_pincode } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: "Name and phone are required" });
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .upsert(
        {
          user_id: req.user.id,
          email: req.user.email,
          name,
          phone,
          address_street: address_street || null,
          address_city: address_city || null,
          address_state: address_state || null,
          address_pincode: address_pincode || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ success: true, profile: data[0] });
  } catch (error) {
    console.error("[onboarding] Error saving profile:", error);
    return res.status(500).json({ error: "Failed to save profile" });
  }
});

// Check onboarding status
app.get("/onboarding/status", verifyAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("name")
      .eq("user_id", req.user.id)
      .single();

    if (error || !data?.name) {
      return res.json({ isOnboarded: false });
    }

    return res.json({ isOnboarded: true });
  } catch (error) {
    console.error("[onboarding] Error checking status:", error);
    return res.json({ isOnboarded: false });
  }
});

// Get user profile
app.get("/profile", verifyAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", req.user.id)
      .single();

    if (error) {
      return res.status(404).json({ error: "Profile not found" });
    }

    return res.json({ profile: data });
  } catch (error) {
    console.error("[profile] Error fetching profile:", error);
    return res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Update user profile
app.patch("/profile", verifyAuth, async (req, res) => {
  try {
    const { name, phone, address_street, address_city, address_state, address_pincode, saved_addresses } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (address_street !== undefined) updates.address_street = address_street;
    if (address_city !== undefined) updates.address_city = address_city;
    if (address_state !== undefined) updates.address_state = address_state;
    if (address_pincode !== undefined) updates.address_pincode = address_pincode;
    if (saved_addresses !== undefined) updates.saved_addresses = saved_addresses;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("user_profiles")
      .update(updates)
      .eq("user_id", req.user.id)
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ success: true, profile: data[0] });
  } catch (error) {
    console.error("[profile] Error updating profile:", error);
    return res.status(500).json({ error: "Failed to update profile" });
  }
});

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`[razorpay] Server listening on http://localhost:${port}`);
});
