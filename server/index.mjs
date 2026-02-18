import express from "express";
import crypto from "crypto";
import Razorpay from "razorpay";

const app = express();

// Basic CORS so the Vite dev server (default 5173) can call this API
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "http://localhost:5173");
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

const port = process.env.PORT || 5001;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`[razorpay] Server listening on http://localhost:${port}`);
});

