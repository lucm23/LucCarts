# LucCarts – Architecture & Implementation Guide

> **Scope:** This document describes the complete architecture, user workflow, and implementation details for the **LucCarts** web app built with **Next.js (App Router) + React + TypeScript + Tailwind CSS + Zustand**. The app delivers a full e‑commerce flow end‑to‑end (login → product browsing → cart/checkout → printable receipt) powered by **Supabase Auth** and a **cloud PostgreSQL database**.

---

## 1) High‑Level Overview

* **Goal:** Ship a fast, cloud-native e‑commerce platform that demonstrates modern React/Next.js patterns with production-grade infrastructure.
* **Non‑Goals:** Real payment processing (mock payments only). Stripe integration is planned.
* **Core Features:**

  1. **Login & Signup** via Supabase Auth → gates protected routes via **middleware**
  2. **Products** catalog displayed from Supabase PostgreSQL (server-rendered)
  3. **Cart & Checkout** using **Zustand** with `localStorage` persistence
  4. **Order Records** stored in Supabase with per-order **receipt** pages

---

## 2) Tech Stack

* **Runtime/Framework:** Next.js 15 (App Router), React 19
* **Language:** TypeScript
* **Styling:** Tailwind CSS v4
* **State:** Zustand (with `persist` middleware to `localStorage` for cart)
* **Database:** Supabase (PostgreSQL with Row Level Security)
* **Authentication:** Supabase Auth
* **Routing/Protection:** Next.js **middleware** + Supabase session check
* **Formatting & Linting:** Preconfigured by `create-next-app` (ESLint)
* **Icons:** React Icons

> Runs on **localhost** with Supabase cloud database. Product images use Amazon and Unsplash URLs.

---

## 3) System Architecture

```text
┌──────────────────────────────────────────────────────────────────┐
│                            Browser (CSR)                         │
│  - Login via Supabase Auth                                       │
│  - Products grid (server-rendered from DB)                       │
│  - Cart state via Zustand → localStorage                         │
│  - Checkout creates order → Supabase database                    │
│  - Receipt page reads from localStorage (legacy)                 │
└───────────────▲───────────────────────────────────────────▲──────┘
                │                                           │
                │ Supabase Session                          │ localStorage (cart only)
                │                                           │
┌───────────────┴───────────────────────────────────────────┴──────┐
│                        Next.js App Router                        │
│  - Route handlers/pages: /login, /products, /checkout, /receipt  │
│  - Shared layout & nav                                           │
│  - Middleware guards protected paths via Supabase session        │
│  - Server/Client components where appropriate                    │
└───────────────────────────────┬──────────────────────────────────┘
                                │
                                │ Supabase Client SDK
                                │
┌───────────────────────────────▼──────────────────────────────────┐
│                         Supabase (Cloud)                         │
│  - PostgreSQL Database (products, orders, order_items, profiles) │
│  - Row Level Security (RLS) policies                             │
│  - Authentication & Session Management                           │
└──────────────────────────────────────────────────────────────────┘
```

### Key Flows

* **Auth:** Supabase Auth handles login/signup → **middleware** checks Supabase session and redirects unauthenticated users from `/products`, `/checkout`, `/receipt/*` to `/login`.
* **Catalog:** Products fetched from Supabase `products` table (server component) → rendered in grid via `ProductCard` components.
* **Cart:** `useCart` (Zustand store) tracks items `{ product, qty }`, persists via `localStorage`.
* **Checkout:** computes subtotal + tax, then **"Pay with Prop Money"** creates order in Supabase `orders` table and order items in `order_items` table; clears the cart and navigates to `/receipt/<ORDER_ID>`.
* **Receipt:** currently reads from `localStorage` (legacy); **TODO:** migrate to fetch from database.

---

## 4) Directory & Files

```text
src/
  app/
    layout.tsx              # Global shell (nav, metadata, PWA installer)
    globals.css             # Tailwind layers + mobile optimizations

    login/page.tsx          # Supabase email/password login (client)
    signup/page.tsx         # Account registration (client)
    products/page.tsx       # Product grid (server component + client cards)
    checkout/page.tsx       # Cart UI + summary + pay (client)
    receipt/[id]/page.tsx   # Printable receipt (client)
    profile/page.tsx        # User profile page (client)

    not-found.tsx           # 404 fallback

  components/
    ProductCard.tsx         # Reusable product card (client)
    MobileNavigation.tsx    # Responsive nav with mobile hamburger menu
    Icons.tsx               # SVG icon components (Google, Meta, Apple, User)
    PWAInstaller.tsx        # Progressive Web App install prompt

  lib/
    products.ts             # Product type definitions
    currency.ts             # USD formatting helper
    auth.ts                 # Auth utilities

  store/
    cart.ts                 # Zustand store (+persist) for cart state

  utils/
    supabase/
      client.ts             # Supabase client for client components
      server.ts             # Supabase client for server components

middleware.ts               # Route protection via Supabase session check
```

**Rationale:**

* **App Router** keeps pages co‑located under `app/` with server/client components as needed.
* **lib/** hosts pure helpers and typed data.
* **store/** isolates state logic from components.
* **middleware.ts** cleanly guards protected routes without duplicating checks in each page.

---

## 5) Routing Model

| Route           | Type                       | Purpose                                   | Auth          |
| --------------- | -------------------------- | ----------------------------------------- | ------------- |
| `/login`        | Client page                | Mock sign‑in; sets `mini_session` cookie  | Public        |
| `/products`     | Server page → Client cards | Browse catalog; add to cart               | **Protected** |
| `/checkout`     | Client page                | Edit quantities, see totals, pay (mock)   | **Protected** |
| `/receipt/[id]` | Client page                | Render printable receipt                  | **Protected** |
| `/`             | (optional redirect)        | Could redirect to `/login` or `/products` | Public        |

---

## 6) Data Model

### Product (Database Schema)

```ts
{
  id: number,              // Auto-incrementing primary key
  name: string,
  price: number,           // cents (integer)
  image_url: string,
  brand?: string,
  category?: string,
  rating?: number,
  created_at: timestamp,   // Auto-generated
  updated_at: timestamp    // Auto-generated
}
```

**Note:** Client-side components receive products with `image_url` mapped to `image` for compatibility.

### Cart Item

```ts
{
  product: Product,
  qty: number
}
```

### Order (Database Schema)

```ts
{
  id: number,              // Auto-incrementing primary key
  user_id: string,         // Foreign key to auth.users
  total_amount: decimal,   // Total in dollars (e.g., 25.00)
  status: string,          // 'paid', 'pending', 'cancelled'
  created_at: timestamp,   // Auto-generated
  updated_at: timestamp    // Auto-generated
}
```

### Order Item (Database Schema)

```ts
{
  id: number,              // Auto-incrementing primary key
  order_id: number,        // Foreign key to orders
  product_id: number,      // Foreign key to products
  quantity: number,
  price_at_purchase: number, // Price in cents at time of purchase
  created_at: timestamp    // Auto-generated
}
```

### Receipt (Legacy - localStorage)

```ts
{
  id: string,                          // e.g., order ID from database
  items: { id: string; name: string; qty: number; price: number }[],
  subtotal: number,                    // in cents
  tax: number,                         // in cents
  total: number,                       // in cents
  createdAt: string                    // ISO timestamp
}
```

**Note:** Receipt page currently uses localStorage. Migration to database queries is planned.

---

## 7) State Management

* **Zustand store** `useCart` keeps `items`, `add`, `remove`, `setQty`, `clear`, `totalCents`.
* **Cart Persistence:** `persist` middleware uses `localStorage` key `mini-shop-cart`.
* **Orders:** Stored in Supabase database (`orders` and `order_items` tables) with user association.
* **Products:** Fetched from Supabase `products` table on each page load (server-side).
* **Receipts (Legacy):** Currently written to `localStorage` as `receipt:<ORDER_ID>` for backward compatibility.

---

## 8) Authentication & Authorization

* **Auth Provider:** Supabase Auth with email/password authentication.
* **Session Management:** Supabase handles session tokens via cookies (HttpOnly, Secure).
* **Middleware:** checks Supabase session on protected paths (`/products`, `/checkout`, `/receipt/*`) → redirects to `/login?redirect=<original>` if unauthenticated.
* **User Profiles:** Automatically created in `profiles` table via database trigger on signup.
* **Security:** Production-ready with proper session handling, CSRF protection, and secure cookies.
* **Future Enhancements:** OAuth providers (Google, GitHub), magic link authentication, password reset flows.

---

## 9) UI & Styling

* **Tailwind CSS** for utility‑first styling across pages.
* **Visual Language:** clean cards, subtle borders/shadows, responsive grid.
* **Print Styles:** the receipt relies on browser default print; optional `@media print` rules can hide nav.
* **Accessibility:**

  * Use semantic elements (`<button>`, `<label>`, `<nav>`)
  * Inputs have associated labels
  * Sufficient color contrast for text/buttons

---

## 10) Business Logic

* **Tax:** fixed 8.25% mock tax (rounded to cents).
* **Checkout:** "Pay with Prop Money" creates order in database with:
  1. User authentication check
  2. Order record creation in `orders` table
  3. Order items creation in `order_items` table
  4. Cart clearing and navigation to receipt page
* **Totals:** computed in cents to avoid floating‑point precision issues; formatted via `Intl.NumberFormat`.
* **Price Preservation:** `price_at_purchase` field in `order_items` preserves historical pricing.

---

## 11) Error Handling & Edge Cases

* **Empty Cart:** checkout page displays an empty state with link back to products.
* **Missing Receipt:** receipt page shows fallback with link back to products.
* **Invalid Qty:** quantity input clamps to minimum `1`.
* **Broken Images:** placeholder service (`picsum.photos`) mitigates; optionally add `onError` to swap to a local fallback.

---

## 12) Performance Considerations

* **Server-Rendered Catalog:** products are fetched from Supabase at the server level, delivering fast initial page loads.
* **Granular Client Components:** cart & checkout are client‑only; product list page is a server component rendering client cards.
* **Persistent Store:** Zustand persistence reduces re‑fetch overhead and enables quick reloads.

---

## 13) Local Development & Runbook

### Prerequisites

* Node.js **18+**
* npm (or pnpm/yarn)
* VS Code (recommended)

### Bootstrap

```bash
npx create-next-app@latest mini-shop \
  --typescript --eslint --tailwind --app --src-dir --import-alias "@/*"
cd mini-shop
code .
```

Ensure Tailwind is active in `globals.css` and `tailwind.config.*` includes `./src/**/*.{ts,tsx}` in `content`.

### Install additional deps

```bash
npm i zustand @supabase/supabase-js @supabase/ssr react-icons
```

### Run

```bash
npm run dev
# open http://localhost:3000/login
```

### VS Code Tips

* Recommended extensions: **ES7+ React/Redux/TS Snippets**, **Tailwind CSS IntelliSense**
* Use multi‑cursor and snippet shortcuts for rapid UI scaffolding

---

## 14) Testing Checklist (Manual)

* **Auth Redirects**

  * Visit `/products` while logged out → redirected to `/login`
  * Log in → redirected back to original page
* **Catalog**

  * Cards render with name, price, brand, category
  * "Add to cart" increments quantity
* **Cart/Checkout**

  * Quantity edits recalc totals
  * Remove item works; empty cart shows message
  * Pay → generates order ID and clears cart
* **Receipt**

  * URL like `/receipt/ORD-XXXX` loads with correct items & totals
  * **Print** produces clean page (no nav if you hide via CSS)

---

## 15) Extensibility & Future Work

* **Receipt Migration:** ✅ **Priority** - Migrate receipt page from localStorage to database queries
* **Order History:** `/orders` page that displays user's past orders from database
* **Admin Dashboard:** Product management, order tracking, user management
* **Auth Enhancements:** OAuth providers (Google, GitHub), magic links, password reset
* **Filters & Search:** Client-side filtering and search with query params
* **Real Payments:** Stripe integration for actual payment processing
* **Inventory Management:** Stock tracking, low inventory alerts
* **UI Library:** Integrate shadcn/ui for consistent components
* **Accessibility:** Enhanced keyboard navigation, ARIA labels, screen reader support
* **i18n:** Multi-language support and locale-specific formatting
* **Performance:** Image optimization, caching strategies, pagination for large catalogs

---

## 16) Security Notes

* **Production-Ready Auth:** Supabase handles secure session management with HttpOnly cookies.
* **Row Level Security (RLS):** Database policies ensure users can only access their own orders.
* **Environment Variables:** Supabase credentials stored in `.env.local` (not committed to git).
* **HTTPS Required:** Supabase requires HTTPS in production for secure communication.
* **API Keys:** Using public anon key (safe for client-side); service role key should never be exposed.
* **Input Validation:** Add server-side validation for order creation and product updates.
* **Rate Limiting:** Consider implementing rate limiting for API endpoints in production.

---

## 17) FAQ

**Q: Why Zustand over Context?**
A: Simpler API, minimal boilerplate, and built‑in `persist` makes cart state tiny and reliable.

**Q: Why does the receipt page still use localStorage?**
A: This is a legacy holdover. Orders are already stored in Supabase. Migrating receipts to fetch from the database is a tracked priority item.

**Q: Can I swap Tailwind for another UI kit?**
A: Yes—Tailwind keeps it quick, but you can layer shadcn/ui or Chakra for components.

---

## 18) Glossary

* **App Router:** Next.js routing paradigm using `app/` directory with server/client components.
* **Middleware:** Edge layer that can rewrite/redirect before hitting your route code.
* **CSR/SSR:** Client‑Side Rendering / Server‑Side Rendering.

---

## 19) License & Attribution

* [MIT License](../LICENSE) — use freely for learning or as a starter template.
