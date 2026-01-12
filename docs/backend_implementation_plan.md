# Backend Implementation Plan: User Login & Order Tracking

## 1. Overview
**Goal:** Enable User Login, Product Selection, and Checkout, with data visible in backend tables.
**Stack:** Next.js (Frontend) + **Supabase** (Backend: Auth + PostgreSQL Database).
**Tool for Viewing Data:** Supabase Dashboard (Table Editor).

---

## 2. Database Schema (The Tables)
We will create these 4 tables in Supabase to track exactly "who bought what".

### A. `profiles` (Users)
*Automatic sync with Supabase Auth.*
*   `id` (UUID, Primary Key): Links to Supabase Auth User ID.
*   `email` (Text): User's email.
*   `role` (Text): 'customer' (default) or 'admin'.

### B. `products` (Inventory)
*   `id` (Integer, Primary Key): Unique ID (e.g., 1, 2, 3).
*   `name` (Text): e.g., "Red Bull".
*   `price` (Numeric): e.g., 2.50.
*   `image_url` (Text): Link to image.
*   `stock` (Integer): Available quantity.

### C. `orders` (Transactions)
*   `id` (Integer, Primary Key): Unique Order #.
*   `user_id` (UUID, Foreign Key): Links to `profiles.id`.
*   `created_at` (Timestamp): Date of purchase.
*   `total_amount` (Numeric): e.g., 25.00.
*   `status` (Text): 'pending', 'paid', 'delivered'.

### D. `order_items` (Details)
*Connects Orders to Products.*
*   `id` (Integer, Primary Key).
*   `order_id` (Integer, Foreign Key): Links to `orders.id`.
*   `product_id` (Integer, Foreign Key): Links to `products.id`.
*   `quantity` (Integer): How many of this item.
*   `price_at_purchase` (Numeric): Price at the specific time of buying.

---

## 3. Implementation Steps

### Phase 1: Setup & Configuration
1.  **Create Supabase Project**
    *   Go to [supabase.com](https://supabase.com) -> New Project "LucCarts".
    *   Get `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2.  **Environment Variables**
    *   Create `.env.local` in `frontend/`.
    *   Add the keys from step 1.
3.  **Install Dependencies**
    *   Run `npm install @supabase/supabase-js @supabase/ssr`.

### Phase 2: Database Creation
1.  **Run SQL Script** (In Supabase SQL Editor):
    *   Copy/Paste the schema definitions to create the tables.
    *   Set up "Row Level Security" (RLS) policies so users can only see their own orders.

### Phase 3: Frontend Integration
1.  **Authentication Client**
    *   Create `utils/supabase/client.ts` to initialize the connection.
2.  **Login Page**
    *   Update Login logic to use `supabase.auth.signInWithPassword`.
3.  **Product Fetching**
    *   Update the Product Grid to fetch from the `products` table instead of hardcoded data.
4.  **Checkout Logic**
    *   When user clicks "Place Order":
        *   Insert row into `orders`.
        *   Insert rows into `order_items` for each cart item.
        *   Clear the cart.

---

## 4. How to Verify (The "See it in Tables" Part)
Once implemented, you will verify the flow:
1.  Open your App (localhost), Login as "User A".
2.  Add a standard item to the cart and Buy.
3.  **Go to Supabase Dashboard -> Table Editor**.
4.  Open `orders` table -> See the new row for User A.
5.  Open `order_items` table -> See exactly what items were in that order.
