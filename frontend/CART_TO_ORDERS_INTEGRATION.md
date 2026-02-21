# Cart to Orders Integration Guide

This guide shows how to integrate order saving with your existing Razorpay checkout flow in Cart.tsx.

## Current Flow (Cart.tsx)

Your current checkout process:
1. User completes checkout
2. Razorpay payment dialogue opens
3. Payment is completed/verified
4. Success/error handling

## New Flow With Order Saving

1. User completes checkout
2. Razorpay payment dialogue opens
3. Payment is completed/verified ✅
4. **Order data saved to server** ← NEW
5. **Redirect to /orders page**
6. Success/error handling

## Implementation Steps

### Step 1: Import Order Service

At the top of your `Cart.tsx`, add:

```typescript
import { verifyAndSaveOrder } from "@/services/orderService";
```

### Step 2: Modify Payment Verification Handler

In your `handleCheckout` function, update the Razorpay payment handler:

```typescript
const handleCheckout = async () => {
  if (items.length === 0) {
    toast.error("Your cart is empty");
    return;
  }

  if (!user) {
    toast.error("Please sign in to complete your purchase");
    navigate("/auth");
    return;
  }

  const shippingFee = totalPrice >= 999 ? 0 : 99;
  const grandTotal = totalPrice + shippingFee;

  setIsCheckingOut(true);

  try {
    // Create Razorpay order as before
    const orderResponse = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/create-order`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: grandTotal,
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
          notes: {
            userId: user.id,
            itemCount: items.length,
          },
        }),
      }
    );

    const orderData = await orderResponse.json();

    if (!orderData.id) {
      toast.error("Failed to create order");
      return;
    }

    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      toast.error("Failed to load payment gateway");
      return;
    }

    const options = {
      key: "YOUR_RAZORPAY_KEY_ID", // Add your key here
      amount: Math.round(grandTotal * 100),
      currency: "INR",
      name: "Your Store Name",
      description: `Order for ${items.length} items`,
      order_id: orderData.id,
      handler: async (response: any) => {
        // ✨ NEW: Save order after successful payment
        const orderResult = await verifyAndSaveOrder(
          response.razorpay_order_id,
          response.razorpay_payment_id,
          response.razorpay_signature,
          {
            amount: Math.round(grandTotal * 100), // Convert to paise
            items: items.map((item) => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
            shippingAddress: {
              // Add actual address from form if available
              street: "Customer Address Street",
              city: "City",
              state: "State",
              zip: "ZIP Code",
            },
          },
          session?.access_token || ""
        );

        if (orderResult.success) {
          toast.success("Order placed successfully!");
          clearCart();
          // Redirect to orders page
          navigate("/orders");
        } else {
          toast.error(
            orderResult.error || "Failed to save order"
          );
        }
      },
      prefill: {
        email: user.email || "",
        contact: "9999999999", // Add actual phone if available
      },
      theme: {
        color: "#3b82f6",
      },
      modal: {
        ondismiss: () => {
          setIsCheckingOut(false);
        },
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  } catch (error) {
    console.error("Checkout error:", error);
    toast.error("An error occurred during checkout");
  } finally {
    setIsCheckingOut(false);
  }
};
```

### Step 3: Add Routes to Router

In your main router file (usually `App.tsx` or `routes.tsx`):

```typescript
import Orders from "@/pages/Orders";
import AdminPanel from "@/pages/AdminPanel";

// Add to your route configuration:
{
  path: "/orders",
  element: <Orders />,
},
{
  path: "/admin",
  element: <AdminPanel />,
}
```

### Step 4: Add Navigation Links

Add links to order pages in your Header/Navigation:

```typescript
// In your Header or Navigation component
<Link to="/orders" className="nav-link">
  My Orders
</Link>

// For admin users (conditionally show)
{userRole === "admin" && (
  <Link to="/admin" className="nav-link">
    Admin Panel
  </Link>
)}
```

## Complete Code Example

Here's a simplified complete implementation:

```typescript
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { verifyAndSaveOrder } from "@/services/orderService";

const Cart = () => {
  const { user, session } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setIsCheckingOut(true);
    const grandTotal = totalPrice + (totalPrice >= 999 ? 0 : 99);

    try {
      // Step 1: Create Razorpay order
      const orderRes = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/create-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: grandTotal,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
          }),
        }
      );

      const razorpayOrder = await orderRes.json();

      // Step 2: Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        // Step 3: Open payment dialog
        new window.Razorpay({
          key: import.meta.env.VITE_RAZORPAY_KEY,
          amount: Math.round(grandTotal * 100),
          order_id: razorpayOrder.id,
          handler: async (response: any) => {
            // Step 4: Save order after payment
            const result = await verifyAndSaveOrder(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              {
                amount: Math.round(grandTotal * 100),
                items: items.map((item) => ({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                })),
              },
              session?.access_token || ""
            );

            if (result.success) {
              toast.success("Order placed!");
              clearCart();
              navigate("/orders");
            } else {
              toast.error("Failed to save order");
            }
          },
        }).open();
      };
      document.body.appendChild(script);
    } catch (error) {
      toast.error("Checkout failed");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div>
      {/* Your cart UI */}
      <button onClick={handleCheckout} disabled={isCheckingOut}>
        {isCheckingOut ? "Processing..." : "Checkout"}
      </button>
    </div>
  );
};

export default Cart;
```

## Data Validation

Before sending to server, ensure:

```typescript
// Amount must be in paise (rupees * 100)
const amountInPaise = grandTotal * 100; // ✅ Correct
const amountInRupees = grandTotal;      // ❌ Wrong

// Items must have correct structure
const itemData = {
  id: "string",        // Required
  name: "string",      // Required
  price: "number",     // In rupees
  quantity: "number",  // Required
};

// Auth token must be valid
const token = session?.access_token; // ✅ From Supabase
```

## Error Handling

The order service returns:

```typescript
{
  success: true,
  order: { /* order data */ }
}
// or
{
  success: false,
  error: "Error message"
}
```

Handle different error cases:

```typescript
if (result.success) {
  // ✅ Order saved successfully
  clearCart();
  navigate("/orders");
} else if (result.error?.includes("Admin")) {
  // User not authenticated
  toast.error("Please sign in first");
} else if (result.error?.includes("verification")) {
  // Payment verification failed
  toast.error("Payment verification failed");
} else {
  // Generic error
  toast.error(result.error);
}
```

## Testing

Test with this flow:

1. **Add items to cart** ✅
2. **Click checkout** ✅
3. **Enter test card:** `4111 1111 1111 1111` ✅
4. **Verify payment succeeds** ✅
5. **Check /orders page** - Should see the order ✅
6. **Check admin panel** - Should see it there too ✅

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Bearer token required" | Ensure user is logged in |
| Order not showing | Check Supabase table for order |
| "Admin access required" | Use service role key on server |
| Amount mismatch | Verify amount is in paise |
| Items array empty | Ensure cart items before checkout |

## Next Steps

1. Store shipping address in checkout form
2. Add order confirmation email
3. Implement order tracking
4. Add cancel/refund functionality
5. Set up inventory management
