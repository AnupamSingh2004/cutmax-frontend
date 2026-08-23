# CutMax Frontend

Next.js (App Router) + Tailwind CSS storefront and admin panel for CutMax Technologies. Talks to
`cutmax-backend` over HTTP with credentialed requests (httpOnly session cookies + CSRF headers).

## Structure

- `src/app/(storefront)/*` — public storefront: home, product catalogue, product detail, cart/enquiry
  bag, checkout (submits an enquiry then hands off to WhatsApp), customer account (login/register/my
  enquiries), about, contact.
- `src/app/admin/*` — admin panel, gated behind its own admin session (`/admin/login`), fully separate
  from the customer auth used by the storefront: dashboard (KPIs + charts), products (CRUD, inline
  price/stock edit, image upload), bulk product/image import, price tiers, enquiries + PDF quote
  export, settings, audit log.
- `src/components/ui` — shared primitives (Button, Input, Badge, Skeleton, Drawer/Modal, Pagination).
- `src/components/storefront`, `src/components/admin` — feature components.
- `src/lib/api-client.ts` — browser fetch wrapper (credentials, CSRF token injection).
- `src/lib/api-server.ts` — server-side fetch helper for Server Components that need cookie-forwarded auth.
- `src/lib/cart-store.ts` — Zustand + localStorage cart, versioned key so schema changes don't break old carts.
- `src/lib/taxonomy.ts` — static category tree, mirrors the same file in `cutmax-backend`.

## Local development

1. Make sure `cutmax-backend` is running (see its README) at `http://localhost:3000`.
2. ```bash
   cp .env.example .env
   npm install
   npm run dev
   ```
   The storefront runs at `http://localhost:3001` (admin panel at `/admin`).

## Design system

- Logo: `public/logo.png` (copied from the legacy site).
- Font: self-hosted Inter (`src/fonts/*.otf`) via `next/font/local`.
- Color tokens (Tailwind v4 `@theme`, see `src/styles/globals.css`): deep navy (`navy-900`/`navy-950`)
  for headers/footer/hero, cream/beige (`cream-300`) as the primary accent/CTA color, rounded
  18–24px cards, soft shadows — matching the legacy site's visual language.
