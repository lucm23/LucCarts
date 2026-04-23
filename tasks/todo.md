# Task Management: Vercel Deployment Readiness Fixes

## Overview
Fix build errors, ESLint warnings, and receipt page data fetching so the project can be cleanly built and deployed to Vercel.

## Checklist

### Step 1 & 2: Planning & Verification
- [x] Create implementation plan and present to user for approval.

### Step 3: Implementation
#### Fix Build Errors
- [x] `login/page.tsx`: Fix `any` type in catch block and unescaped single quote.
- [x] `signup/page.tsx`: Fix `any` type in catch block.
- [x] `receipt/[id]/page.tsx`: Fix unescaped single quotes.

#### Fix Warnings
- [x] Remove unused `router` in `login/page.tsx`.
- [x] Remove unused `Icons` and `router` in `signup/page.tsx`.
- [x] Remove unused `Product` in `products/page.tsx`.
- [x] Fix unused `options` in `middleware.ts`.
- [x] Fix unused vars and dependency warnings in `MobileNavigation.tsx`.
- [x] Fix dependency warning in `profile/page.tsx`.
- [x] Add ESLint disables for `<img>` tags in `checkout/page.tsx` and `ProductCard.tsx` (Ended up using `<Image unoptimized />` instead, which is better).

#### Fix Functional Issue
- [x] Rewrite `receipt/[id]/page.tsx` to fetch order details from Supabase (`orders` and `order_items`) instead of `localStorage`.

### Step 4 & 5: Review & Document Results
- [x] Run `npm run build` to verify the build succeeds.
- [x] Update documentation / `tasks/todo.md` with verification results.

### Step 6: Lessons Learned
- [x] Update `tasks/lessons.md` with any new lessons learned (e.g., Next.js strict build requirements).
