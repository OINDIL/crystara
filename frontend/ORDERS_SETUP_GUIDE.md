# Order Management System Setup Guide

This guide will help you set up the complete order management system with user order history and admin panel.

## Overview

The system includes:
- **Backend API** - Node.js/Express server with Razorpay integration
- **User Order History** - Page where users can view their past orders
- **Admin Panel** - Dashboard for admins to manage all orders and view statistics

## Prerequisites

- Node.js 16+ installed
- Supabase account and project
- Razorpay account and API keys
- Existing React/Vite frontend

## Step 1: Database Setup

### 1.1 Run the Supabase Migration

Execute the SQL migration in your Supabase project:

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Create a new query and copy the entire contents of `supabase/migrations/001_create_orders_table.sql`
4. Execute the migration

This creates:
- `orders` table - stores all customer orders
- `user_profiles` table - stores user role information (user/admin)
- Indexes for performance
- Row Level Security (RLS) policies for data protection

### 1.2 Create an Admin User

To test the admin panel, assign an admin role to a test user:

```sql
INSERT INTO user_profiles (user_id, email, name, role)
VALUES (
  'USER_ID_HERE',
  'admin@example.com',
  'Admin User',
  'admin'
)
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

Replace `USER_ID_HERE` with a real Supabase user ID from `auth.users` table.

## Step 2: Server Configuration

### 2.1 Install Dependencies

```bash
cd server
npm install
```

### 2.2 Create Environment File

Create a `.env` file in the `server` directory:

```
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_secret
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
CORS_ORIGIN=http://localhost:5173
PORT=5001
```

### Getting the Values:

**Razorpay Keys:**
1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to Settings → API Keys
3. Copy Key ID and Secret

**Supabase Values:**
1. Go to your Supabase Project Settings
2. API section → Project URL = `SUPABASE_URL`
3. API Keys section → Service Role Secret = `SUPABASE_SERVICE_ROLE_KEY`

### 2.3 Start the Server

```bash
npm start
```

The server will run on `http://localhost:5001`

## Step 3: Frontend Configuration

### 3.1 Add Environment Variable

Create or update `.env.local` in your root directory:

```
VITE_SERVER_URL=http://localhost:5001
```

### 3.2 Update Cart.tsx

In your Cart checkout flow, after successful payment verification, save the order:

```typescript
// After payment is verified
const saveOrder = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/orders`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`
      },
      body: JSON.stringify({
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        amount: grandTotal * 100, // convert to paise
        items: items, // from your cart
        shippingAddress: {
          street: '...',
          city: '...',
          state: '...',
          zip: '...'
        }
      })
    }
  );
};
```

### 3.3 Add Routes

Update your router configuration to include new pages:

```typescript
import Orders from '@/pages/Orders';
import AdminPanel from '@/pages/AdminPanel';

// Add these routes:
{
  path: '/orders',
  element: <Orders />
},
{
  path: '/admin',
  element: <AdminPanel />
}
```

## API Endpoints

### User Endpoints

#### Create Order
- **POST** `/orders`
- **Auth Required:** Yes
- **Body:**
  ```json
  {
    "orderId": "razorpay_order_id",
    "paymentId": "razorpay_payment_id",
    "amount": 50000,
    "items": [
      {
        "id": "product_1",
        "name": "Product Name",
        "price": 1000,
        "quantity": 5
      }
    ],
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zip": "10001"
    }
  }
  ```

#### Get User's Orders
- **GET** `/orders/user/history`
- **Auth Required:** Yes
- **Response:**
  ```json
  {
    "orders": [
      {
        "id": "uuid",
        "order_id": "razorpay_order_id",
        "amount": 50000,
        "status": "completed",
        "created_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
  ```

#### Get Order Details
- **GET** `/orders/:id`
- **Auth Required:** Yes

### Admin Endpoints

#### Get All Orders (Paginated)
- **GET** `/admin/orders?page=1&limit=20&status=completed&userId=uuid`
- **Auth Required:** Yes (Admin only)
- **Query Parameters:**
  - `page` - Page number (default: 1)
  - `limit` - Items per page (default: 20)
  - `status` - Filter by status (pending, completed, failed, cancelled)
  - `userId` - Filter by user ID

#### Update Order Status
- **PATCH** `/admin/orders/:id`
- **Auth Required:** Yes (Admin only)
- **Body:**
  ```json
  {
    "status": "completed"
  }
  ```

#### Get Order Statistics
- **GET** `/admin/orders/stats/overview`
- **Auth Required:** Yes (Admin only)
- **Response:**
  ```json
  {
    "totalOrders": 150,
    "totalRevenue": 500000,
    "completedOrders": 140,
    "pendingOrders": 5,
    "failedOrders": 5
  }
  ```

## Testing

### 1. Test User Order Flow

1. Sign up a test account
2. Add items to cart
3. Complete checkout with Razorpay test payment
4. Go to `/orders` to see your order history

### 2. Test Admin Panel

1. Sign in as admin user
2. Go to `/admin`
3. View all orders, search, filter by status
4. Click on an order to see full details
5. Update order status using the dropdown menu

### Test Razorpay Credentials

For testing without real payments, use:
- Card Number: `4111 1111 1111 1111`
- Expiry: Any future date
- CVV: Any 3 digits

## Troubleshooting

### "Admin access required" error
- Check that the user has an admin role in `user_profiles` table
- Verify the role is exactly `'admin'`

### Orders not showing up
- Ensure the order was saved with a valid auth token
- Check server logs for errors
- Verify the order amount is in paise (multiply rupees by 100)

### CORS errors
- Make sure `CORS_ORIGIN` in `.env` matches your frontend URL
- For development, use `http://localhost:5173`
- For production, use your actual domain

### Supabase connection issues
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are correct
- Check that the service role key has admin permissions
- Ensure the tables are created successfully

## Security Notes

1. **Service Role Key:** Keep this secret! Never expose it in frontend code.
2. **RLS Policies:** The policies ensure users can only see their own data.
3. **Admin Role:** Only assign admin role to trusted users.
4. **Authorization:** Always verify the auth token in your backend.

## Production Deployment

When deploying to production:

1. Update `.env` with production values
2. Update `CORS_ORIGIN` to your production domain
3. Use HTTPS for all endpoints
4. Set up proper error logging
5. Configure database backups
6. Test email notifications for orders (optional)
7. Set up monitoring and alerts

## Next Steps

1. Add email notifications when order status changes
2. Implement order tracking with estimated delivery dates
3. Add invoice generation and PDF download
4. Set up automated refund processing for failed orders
5. Add customer support ticket system for order issues

## Support

For issues or questions:
- Check server logs: `npm start`
- Test API endpoints using Postman or curl
- Review Supabase documentation: https://supabase.com/docs
- Check Razorpay integration guide: https://razorpay.com/developers/
