# Backend Technology Research for LucCarts

## Overview
**LucCarts** is a campus-focused grocery delivery app built with **Next.js 15, React 19, and Tailwind CSS 4**. Since the `backend/` directory is currently empty, you have a clean slate to choose a backend architecture.

Based on your tech stack and the requirements of a grocery delivery app (real-time tracking, complex data relationships, authentication), here are the top recommendations.

---

## Top Recommendation: Supabase (BaaS)
**Why:** It offers the speed of Firebase but with a **SQL (PostgreSQL)** database, which is crucial for the relational data structure of an e-commerce app (Orders linked to Users, Products linked to Categories, etc.).

*   **Type:** Backend-as-a-Service (Open Source Firebase alternative)
*   **Language:** PostgreSQL (Database), JavaScript/TypeScript (Client SDK)
*   **Pros:**
    *   **Built-in Auth:** Easily handle Student (.edu emails), Driver, and Admin roles.
    *   **Real-time:** Subscribe to database changes instantly (perfect for "Order Status: Out for Delivery").
    *   **Relational Data:** PostgreSQL is far superior to NoSQL for querying complex orders and inventory.
    *   **Next.js Integration:** First-class support with leveraging Next.js Middleware for auth protection.
*   **Cons:**
    *   Less control than a custom server (though you can write Edge Functions).

## Alternative 1: Custom Node.js (NestJS or Express)
**Why:** If you want total control and maximum scalability. This is the "standard" industry approach for large-scale enterprise apps.

*   **Type:** Custom Server
*   **Language:** TypeScript / Node.js
*   **Pros:**
    *   **Flexibility:** You define every single endpoint and logic flow.
    *   **Unified Language:** Keep everything in TypeScript (Frontend + Backend).
    *   **Ecosystem:** Access to the massive NPM ecosystem.
*   **Cons:**
    *   **High Setup Effort:** You must manually set up Auth, Database ORM (Prisma/TypeORM), DevOps, Hosting, and Realtime sockets (Socket.io).
    *   **Slower to MVP:** Takes longer to get the first feature out compared to Supabase.

## Alternative 2: Python (FastAPI or Django)
**Why:** If you plan to heavily rely on AI/ML features (e.g., smart route optimization, product recommendation engines) in the near future.

*   **Type:** Custom Server
*   **Language:** Python
*   **Pros:**
    *   **Data Science:** Seamless integration with Python's data science libraries (Pandas, NumPy, Scikit-learn).
    *   **Speed:** FastAPI is incredibly fast and easy to document (auto-generated Swagger UI).
*   **Cons:**
    *   **Context Switching:** You'll have to switch between TypeScript (Front) and Python (Back).
    *   **Deployment:** Slightly more complex to host alongside a Next.js app than a pure JS stack.

---

## Suggested Architecture (MVP)

For **LucCarts**, aiming for a balance of *speed to delivery* and *robustness*, **Supabase** is the strongest candidate.

### Tech Stack Recommendation:
*   **Database:** PostgreSQL (via Supabase)
*   **Auth:** Supabase Auth (Email/Password + Social Login)
*   **ORM:** Prisma (optional, but recommended if you want type-safe DB access from Next.js API routes)
*   **Payments:** Stripe (integrated via Next.js API Routes / Edge Functions)
*   **Realtime:** Supabase Realtime (for order tracking)

### Database Schema Draft (Key Entities):
1.  **Users:** `id, email, role (student/driver/admin), .edu_verified`
2.  **Products:** `id, name, price, category_id, stock_count, image_url`
3.  **Orders:** `id, customer_id, driver_id, status (pending/shopping/delivering/done), total`
4.  **OrderItems:** `id, order_id, product_id, quantity, price_at_purchase`
5.  **Stores:** `id, name, location_lat, location_lng` (if multi-vendor)

## Next Steps
1.  **Select a Backend:** Choose between Supabase (Speed/Relational) or Node.js (Control).
2.  **Initialize Project:**
    *   If **Supabase**: Create a project at supabase.com and connect env vars.
    *   If **Node.js**: Run `npx nest new backend` inside the `backend/` folder.
