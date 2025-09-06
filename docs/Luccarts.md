# Mini Shop – Architecture & Implementation Guide

> **Scope:** This document describes the complete architecture, user workflow, and implementation details for the **Mini Shop** web app built with **Next.js (App Router) + React + TypeScript + Tailwind CSS + Zustand**. The app runs **locally** and simulates e‑commerce flows end‑to‑end (login → product browsing → cart/checkout → printable receipt) with **mock auth** and **local data**.

---

## 1) High‑Level Overview

* **Goal:** Ship a fast, self‑contained mini e‑commerce that demonstrates modern React/Next.js patterns without external services.
* **Non‑Goals:** Production‑grade security, real payments, and persistent server databases. (Everything is local/dev.)
* **Core Features:**

  1. **Login** (mock; cookie flag only) → gates protected routes via **middleware**
  2. **Products** ("Walmart‑like" catalog) displayed from a local module
  3. **Cart & Checkout** using **Zustand** with `localStorage` persistence
  4. **Receipt** generation stored in `localStorage`, with a printable page

---

## 2) Tech Stack

* **Runtime/Framework:** Next.js (App Router), React 18
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **State:** Zustand (with `persist` middleware to `localStorage`)
* **Routing/Protection:** Next.js **middleware** + cookie check
* **Formatting & Linting:** Preconfigured by `create-next-app` (ESLint)

> Runs entirely on **localhost** (no external APIs required). Images use placeholder URLs.

---

## 3) System Architecture

```text
┌──────────────────────────────────────────────────────────────────┐
│                            Browser (CSR)                         │
│  - Login form sets cookie (dev)                                  │
│  - Products grid (client)                                        │
│  - Cart state via Zustand → localStorage                         │
│  - Checkout triggers receipt creation → localStorage             │
│  - Receipt page reads receipt by ID → printable                  │
└───────────────▲───────────────────────────────────────────▲──────┘
                │                                           │
                │ Cookies (mock auth)                       │ localStorage (cart, receipts)
                │                                           │
┌───────────────┴───────────────────────────────────────────┴──────┐
│                        Next.js App Router                        │
│  - Route handlers/pages: /login, /products, /checkout, /receipt  │
│  - Shared layout & nav                                           │
│  - Middleware guards protected paths                             │
│  - Server/Client components where appropriate                    │
└──────────────────────────────────────────────────────────────────┘
```

### Key Flows

* **Auth:** client login sets `mini_session=true` cookie → **middleware** redirects unauthenticated users from `/products`, `/checkout`, `/receipt/*` to `/login`.
* **Catalog:** in‑repo `products.ts` exports product array → rendered in grid via `ProductCard` components.
* **Cart:** `useCart` (Zustand store) tracks items `{ product, qty }`, persists via `localStorage`.
* **Checkout:** computes subtotal + tax, then **"Pay with Prop Money"** creates a receipt object and saves it to `localStorage` under `receipt:<ORDER_ID>`; clears the cart and navigates to `/receipt/<ORDER_ID>`.
* **Receipt:** reads the stored object, renders line items and totals; includes **Print** action (`window.print()`).

---

## 4) Directory & Files

```text
src/
  app/
    layout.tsx              # Global shell (header/nav), Metadata
    globals.css             # Tailwind layers (base, components, utilities)

    login/page.tsx          # Mock login (client component)
    products/page.tsx       # Product grid (server component + client children)
    checkout/page.tsx       # Cart UI + summary + pay (client)
    receipt/[id]/page.tsx   # Printable receipt (client)

    not-found.tsx           # 404 fallback

  components/
    ProductCard.tsx         # Reusable product card (client)

  lib/
    products.ts             # Local catalog data + types
    currency.ts             # USD formatting helper
    auth.ts                 # Cookie helpers + middleware utilities

  store/
    cart.ts                 # Zustand store (+persist) for cart state

middleware.ts               # Route protection for /products, /checkout, /receipt
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

### Product

```ts
{
  id: string,
  name: string,
  price: number, // cents
  image: string,
  brand?: string,
  category?: string,
  rating?: number
}
```

### Cart Item

```ts
{
  product: Product,
  qty: number
}
```

### Receipt

```ts
{
  id: string,                          // e.g., ORD-8F2K0WZQ
  items: { id: string; name: string; qty: number; price: number }[],
  subtotal: number,                    // in cents
  tax: number,                         // in cents
  total: number,                       // in cents
  createdAt: string                    // ISO timestamp
}
```

---

## 7) State Management

* **Zustand store** `useCart` keeps `items`, `add`, `remove`, `setQty`, `clear`, `totalCents`.
* **Persistence:** `persist` middleware uses `localStorage` key `mini-shop-cart`.
* **Receipts:** Written directly to `localStorage` as `receipt:<ORDER_ID>`; (optional) maintain an index `receipts:index` for a history page.

---

## 8) Authentication & Authorization (Dev‑Only)

* **Login Strategy:** any email/password accepted. On submit, set `document.cookie = "mini_session=true; path=/"`.
* **Middleware:** checks for `mini_session=true` cookie on protected paths → otherwise redirects to `/login?redirect=<original>`.
* **Limitations:** not secure; for demo only. No CSRF/expiry/crypto.
* **Upgrade Path:** replace with `next-auth` (Credentials or OAuth) or a simple JWT stored in `HttpOnly` cookie via server actions/route handlers.

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
* **Checkout:** "Pay with Prop Money" simulates success, generates an order ID, writes receipt, clears cart, navigates to receipt page.
* **Totals:** computed in cents to avoid floating‑point precision issues; formatted via `Intl.NumberFormat`.

---

## 11) Error Handling & Edge Cases

* **Empty Cart:** checkout page displays an empty state with link back to products.
* **Missing Receipt:** receipt page shows fallback with link back to products.
* **Invalid Qty:** quantity input clamps to minimum `1`.
* **Broken Images:** placeholder service (`picsum.photos`) mitigates; optionally add `onError` to swap to a local fallback.

---

## 12) Performance Considerations

* **Static Catalog:** products are imported from a module (no network calls).
* **Granular Client Components:** cart & checkout are client‑only; product list page can be server component rendering client cards.
* **Persistent Store:** reduces re‑fetch, enables quick reloads.

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
npm i zustand
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

* **Auth:** NextAuth (Credentials/Email/OAuth), session expiry, password rules
* **Catalog Source:** Move to JSON file or lightweight DB (SQLite) via Prisma
* **Filters & Search:** query params for category/price/name with memoized selectors
* **Receipts Index:** `/orders` page that lists `receipts:index` with basic pagination
* **Payments:** Stripe test mode or fully mocked server route
* **Server Actions:** for order creation + cookie setting with `HttpOnly`
* **UI Library:** Integrate shadcn/ui for consistent buttons, inputs, dialogs
* **Accessibility:** Keyboard navigation, focus rings, aria‑live for cart updates
* **i18n:** Currency/locale formatting and translations

---

## 16) Security Notes (Given Dev Scope)

* Current cookie is **not** `HttpOnly`, has no expiry, and is set from the client → **do not** deploy as‑is.
* For any external demo, switch to server‑set cookies (HttpOnly, Secure, SameSite) and guard POST actions against CSRF.

---

## 17) FAQ

**Q: Why Zustand over Context?**
A: Simpler API, minimal boilerplate, and built‑in `persist` makes cart state tiny and reliable.

**Q: Why localStorage for receipts?**
A: Keeps the demo fully offline/local and avoids adding a DB layer. Swap to SQLite/Prisma when you’re ready.

**Q: Can I swap Tailwind for another UI kit?**
A: Yes—Tailwind keeps it quick, but you can layer shadcn/ui or Chakra for components.

---

## 18) Glossary

* **App Router:** Next.js routing paradigm using `app/` directory with server/client components.
* **Middleware:** Edge layer that can rewrite/redirect before hitting your route code.
* **CSR/SSR:** Client‑Side Rendering / Server‑Side Rendering.

---

## 19) License & Attribution

* Educational/demo code. Use freely for learning or as a starter template.
