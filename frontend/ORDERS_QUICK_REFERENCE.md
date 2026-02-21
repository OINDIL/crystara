# Order Management System - Quick Reference

## Files Created/Modified

### Backend
- `server/index.mjs` - Added order API endpoints
- `server/package.json` - Added @supabase/supabase-js dependency
- `server/.env.example` - Environment variables template

### Frontend Pages
- `src/pages/Orders.tsx` - User order history page
- `src/pages/AdminPanel.tsx` - Admin dashboard

### Database
- `supabase/migrations/001_create_orders_table.sql` - Database schema

### Services & Utilities
- `src/services/orderService.ts` - Order API service functions

### Documentation
- `ORDERS_SETUP_GUIDE.md` - Complete setup guide

## Quick Setup Checklist

- [ ] Run Supabase migration SQL
- [ ] Create admin user in user_profiles
- [ ] Install server dependencies: `cd server && npm install`
- [ ] Create `.env` file in server directory
- [ ] Add `VITE_SERVER_URL` to frontend `.env.local`
- [ ] Add routes to your router (Orders and AdminPanel)
- [ ] Test user order flow
- [ ] Test admin panel

## Key Features

### User Order History (`/orders`)
✅ View all past orders
✅ See order details (items, total, status)
✅ Track order status
✅ View shipping address
✅ Expand/collapse order details
✅ Empty state with shop link

### Admin Panel (`/admin`)
✅ Overview statistics (total orders, revenue, etc.)
✅ Paginated orders table
✅ Search by order ID or customer email
✅ Filter by status
✅ View full order details in modal
✅ Update order status
✅ Responsive design

### Backend API
✅ Create order after payment
✅ Get user's order history
✅ Get single order details
✅ Admin: Get all orders (paginated)
✅ Admin: Update order status
✅ Admin: Get statistics
✅ Auth middleware for protected routes
✅ Admin role verification

### Database
✅ orders table with all necessary fields
✅ user_profiles table for role management
✅ Row Level Security (RLS) policies
✅ Automatic timestamp triggers
✅ Performance indexes

## Environment Variables

```
# Server
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
CORS_ORIGIN=http://localhost:5173
PORT=5001

# Frontend (.env.local)
VITE_SERVER_URL=http://localhost:5001
```

## API Endpoints Summary

| Method | Endpoint | Auth | Admin | Purpose |
|--------|----------|------|-------|---------|
| POST | /orders | ✅ | | Save order after payment |
| GET | /orders/user/history | ✅ | | Get user's orders |
| GET | /orders/:id | ✅ | | Get order details |
| GET | /admin/orders | ✅ | ✅ | Get all orders (paginated) |
| PATCH | /admin/orders/:id | ✅ | ✅ | Update order status |
| GET | /admin/orders/stats/overview | ✅ | ✅ | Get statistics |

## Test Data

**Razorpay Test Card:**
- Number: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: Any 3 digits

**Admin Setup:**
```sql
INSERT INTO user_profiles (user_id, email, name, role)
VALUES ('USER_ID', 'email@example.com', 'Admin Name', 'admin');
```

## Order Status Values

- `pending` - Order created, payment verified
- `completed` - Order processed and shipped
- `failed` - Payment failed or order cancelled
- `cancelled` - Order cancelled by user/admin

## Tables Structure

### orders
- id (UUID)
- user_id (UUID) - Foreign key to auth.users
- order_id (TEXT) - Razorpay order ID
- payment_id (TEXT) - Razorpay payment ID
- amount (INTEGER) - Amount in paise
- items (JSONB) - Array of ordered items
- status (TEXT) - Order status
- shipping_address (JSONB) - Shipping details
- created_at, updated_at (TIMESTAMP)

### user_profiles
- id (UUID)
- user_id (UUID) - Foreign key to auth.users
- email (TEXT)
- name (TEXT)
- role (TEXT) - 'user' or 'admin'
- created_at, updated_at (TIMESTAMP)

## Important Notes

1. **Always use Bearer token** in Authorization header
2. **Amounts are in paise** (1 rupee = 100 paise)
3. **RLS policies protect user data** - users can only see their own orders
4. **Admin verification** happens server-side
5. **Service role key** should never be exposed in frontend code
6. **Test thoroughly** before production deployment

## Troubleshooting Commands

```bash
# Test server is running
curl http://localhost:5001/

# Check environment variables
echo $SUPABASE_URL
echo $RAZORPAY_KEY_ID

# Restart server
npm start

# Check if new packages installed
npm list | grep supabase
```

## Next Phase Ideas

- [ ] Email notifications on order status change
- [ ] Order tracking with timestamps
- [ ] Invoice PDF generation
- [ ] Refund processing
- [ ] Customer support tickets
- [ ] Order analytics dashboard
- [ ] Wishlist to order flow
- [ ] Repeat/reorder functionality
- [ ] Order recommendations
- [ ] Shipping integration with tracking numbers
