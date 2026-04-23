# Lessons Learned

## Lesson: Next.js Client Components and `useSearchParams`
- **Pattern:** Using `useSearchParams()` from `next/navigation` directly in a Client Component's root.
- **Mistake:** During `npm run build`, Next.js throws a prerender error: `useSearchParams() should be wrapped in a suspense boundary`. This causes the static export to fail entirely.
- **Prevention Rule:** Any Client Component that utilizes `useSearchParams` MUST have its main content wrapped in a `<Suspense fallback={<Fallback />}>` boundary to prevent it from bailing out of server-side static rendering.

## Lesson: `Image` Tag vs `<img>` with external domains
- **Pattern:** Using native HTML `<img>` tags to avoid Next.js warnings about configuring remote hostname patterns in `next.config.ts`.
- **Mistake:** It causes a Next.js `no-img-element` ESLint warning, which clutters the build output.
- **Prevention Rule:** Use `<Image src={...} unoptimized width={...} height={...} />`. The `unoptimized` flag bypasses Next.js's image optimization API, which means you don't need to configure remote domains in `next.config.ts`, but you still satisfy ESLint and get standard HTML output without the warnings.
