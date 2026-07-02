# Fabloom – Complete Project Handoff for Gemini AI

> **Last Updated:** 2026-06-20  
> **Live URL:** https://fablooom.vercel.app  
> **Local Path:** `d:\Desktop\Fabloom\`  
> **Purpose:** This document is the single authoritative source for Gemini to understand, resume, and complete building the Fabloom application. Read this fully before touching any code.

---

## 📋 TABLE OF CONTENTS

1. [What Is Fabloom?](#1-what-is-fabloom)
2. [Tech Stack](#2-tech-stack)
3. [Environment Variables](#3-environment-variables)
4. [Project File Structure](#4-project-file-structure)
5. [Routing Architecture](#5-routing-architecture)
6. [Database Models](#6-database-models)
7. [API Routes (Complete Map)](#7-api-routes-complete-map)
8. [State Management](#8-state-management-zustand)
9. [Auth & Middleware](#9-auth--middleware)
10. [What Is FULLY Working](#10-what-is-fully-working)
11. [What Is PARTIALLY Built](#11-what-is-partially-built)
12. [What Is MISSING / Broken](#12-what-is-missing--broken)
13. [Known Bugs](#13-known-bugs)
14. [Priority Task List](#14-priority-task-list)
15. [Component Inventory](#15-component-inventory)
16. [Coding Conventions](#16-coding-conventions)
17. [How to Run Locally](#17-how-to-run-locally)
18. [Admin Panel Access](#18-admin-panel-access)
19. [What Gemini Should Do Next](#19-what-gemini-should-do-next)

---

## 1. What Is Fabloom?

Fabloom is a **premium Islamic fashion e-commerce platform** built for a tailor shop in **Koduvally, Kerala, India**.

### Three product paths:
1. **Readymade garments** — Size-based inventory (S/M/L/XL/XXL). Customer picks size, adds to cart.
2. **Fabrics sold by meter** — Fabric bolts sold per meter. Customer picks meters, adds to cart.
3. **Custom stitching service** — Customer buys fabric + chooses stitching. Submits body measurements. Tailor stitches to order. Admin tracks stitching status per item.

### Core business promise:
- Single checkout handles all three product types together.
- Stitching measurements are embedded in order records so the tailor can see them.
- Admin panel lets the owner manage orders, update stitching status, and manage inventory.

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, TypeScript) |
| React | React 19 |
| Styling | TailwindCSS v3 + shadcn/ui primitives |
| Fonts | Inter (`--font-inter`), Playfair Display (`--font-playfair`), DM Sans (`--font-dm-sans`) |
| Database | MongoDB Atlas + Mongoose v8 |
| Auth | Clerk (`@clerk/nextjs` v6) |
| State (Cart) | Zustand v5 with `persist` (localStorage key: `fabloom-cart-storage`) |
| Forms | React Hook Form + Zod |
| Payment | Razorpay (test mode) |
| Image hosting | Cloudinary |
| Email notifications | Resend (`@react-email/components`) |
| WhatsApp notifications | WATI (currently archived/disabled) |
| Rate limiting | Upstash Redis |
| Monitoring | Sentry |
| PWA | next-pwa |
| Drag-and-drop (admin) | @dnd-kit |
| Charts (admin) | Recharts |
| Data fetching (admin) | SWR |
| Deployment | Vercel |

---

## 3. Environment Variables

File: `d:\Desktop\Fabloom\.env.local`

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://muhammedsuhail6444_db_user:WvIVZVbJ4YO6n7Ez@cluster0.wyfjd2c.mongodb.net/fabloom?retryWrites=true&w=majority

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_c21hc2hpbmctbGFtcHJleS02OC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_QnHlRg48jwv3jG3NOyIYOhXKqo5AIV6nVZPsWyiN3s

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dyrihock8
CLOUDINARY_API_KEY=421918872469445
CLOUDINARY_API_SECRET=OxvT4GsKaR9PoTOshTWjNa4COAo
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=fabloom_unsigned_preset

# Razorpay (test mode)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_RuXn3GldArX6de
RAZORPAY_KEY_SECRET=PThK5tZj4jTtBkMmyAEyNmzF
RAZORPAY_WEBHOOK_SECRET=fabloom_secure_webhook_secret_2026

# Email (Resend)
RESEND_API_KEY=re_4wHrvbjc_G22B1gNVMeoiDBGd46ZE9xFT

# WhatsApp (WATI - currently disabled/archived)
WATI_API_ENDPOINT=https://live-server-123.wati.io
WATI_API_TOKEN=replace_me_token

# Rate Limiting (Upstash)
UPSTASH_REDIS_REST_URL=https://whole-shrew-115554.upstash.io
UPSTASH_REDIS_REST_TOKEN=gQAAAAAAAcNiAAIgcDFmNmNiNTJlMzYyYjU0MzJmOThjYjkwZDAzNmRjNmYyMw

# Sentry
SENTRY_DSN=https://5db28014b83d6de83c4d65b2877f913d@o4511335817412608.ingest.de.sentry.io/4511335828947024
```

**Vercel also needs all the above env vars set in Project Settings > Environment Variables.**

---

## 4. Project File Structure

```
d:\Desktop\Fabloom\
├── src/
│   ├── app/
│   │   ├── page.tsx                          <- Landing page (standalone, no store nav)
│   │   ├── layout.tsx                        <- Root layout (ClerkProvider, fonts, PWA meta)
│   │   ├── globals.css
│   │   ├── (admin)/                          <- Admin route group
│   │   │   ├── layout.tsx                    <- Auth guard + sidebar shell
│   │   │   ├── dashboard/page.tsx            <- WRONG URL: /dashboard (should be /admin/dashboard)
│   │   │   ├── orders/page.tsx               <- WRONG URL: /orders (should be /admin/orders)
│   │   │   ├── orders/[id]/page.tsx          <- WRONG URL
│   │   │   ├── inventory/page.tsx            <- WRONG URL
│   │   │   ├── production/page.tsx           <- WRONG URL
│   │   │   ├── analytics/                    <- EMPTY directory (page not built)
│   │   │   ├── customers/                    <- EMPTY directory (page not built)
│   │   │   ├── measurements/                 <- EMPTY directory (page not built)
│   │   │   ├── settings/
│   │   │   │   ├── notifications/            <- EMPTY
│   │   │   │   └── shipping/                 <- EMPTY
│   │   │   └── products/
│   │   │       └── new/                      <- EMPTY (page not built)
│   │   ├── (store)/                          <- Store route group
│   │   │   ├── layout.tsx                    <- TopCategoryBar + Footer + BottomNav
│   │   │   ├── home/page.tsx                 <- Route: /home (store homepage)
│   │   │   ├── fabrics/page.tsx              <- Route: /fabrics
│   │   │   ├── readymade/page.tsx            <- Route: /readymade
│   │   │   ├── accessories/page.tsx          <- Route: /accessories
│   │   │   ├── caps/page.tsx                 <- Route: /caps
│   │   │   ├── perfumes/page.tsx             <- Route: /perfumes
│   │   │   ├── stitching/page.tsx            <- Route: /stitching
│   │   │   ├── about/page.tsx               <- Route: /about
│   │   │   ├── search/page.tsx              <- Route: /search
│   │   │   ├── cart/page.tsx                <- Route: /cart (BUG: blocks guests)
│   │   │   ├── checkout/page.tsx            <- Route: /checkout
│   │   │   ├── wishlist/page.tsx            <- Route: /wishlist
│   │   │   ├── [type]/                      <- Dynamic product type route
│   │   │   ├── account/
│   │   │   │   ├── page.tsx                 <- Route: /account
│   │   │   │   ├── orders/page.tsx          <- Route: /account/orders
│   │   │   │   ├── orders/[orderId]/page.tsx<- Route: /account/orders/[id]
│   │   │   │   ├── measurements/page.tsx    <- Route: /account/measurements
│   │   │   │   ├── measurements/new/page.tsx<- Route: /account/measurements/new
│   │   │   │   ├── addresses/page.tsx       <- Route: /account/addresses
│   │   │   │   └── notifications/page.tsx   <- Route: /account/notifications
│   │   │   ├── measure-guide/               <- Measurement guide page
│   │   │   ├── privacy/                     <- Privacy policy
│   │   │   └── terms/                       <- Terms of service
│   │   ├── (auth)/
│   │   │   ├── layout.tsx
│   │   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   │   └── sign-up/[[...sign-up]]/page.tsx
│   │   ├── api/
│   │   │   ├── products/route.ts            <- GET /api/products
│   │   │   ├── products/[id]/route.ts       <- GET /api/products/[id]
│   │   │   ├── orders/route.ts              <- POST /api/orders
│   │   │   ├── orders/[id]/route.ts         <- GET /api/orders/[id]
│   │   │   ├── cart/sync/                   <- Cart sync API
│   │   │   ├── checkout/
│   │   │   │   ├── create-razorpay-order/   <- POST: create Razorpay order
│   │   │   │   ├── place-order/             <- POST: finalize order
│   │   │   │   └── verify-payment/          <- POST: verify Razorpay signature
│   │   │   ├── user/
│   │   │   │   ├── profile/                 <- GET/PATCH user profile
│   │   │   │   ├── addresses/               <- CRUD addresses
│   │   │   │   ├── orders/                  <- GET user orders
│   │   │   │   ├── measurements/            <- GET/POST measurement profiles
│   │   │   │   ├── notifications/           <- GET/PATCH notification prefs
│   │   │   │   └── wishlist/                <- GET/POST/DELETE wishlist
│   │   │   └── admin/
│   │   │       ├── analytics/route.ts       <- GET /api/admin/analytics
│   │   │       ├── orders/route.ts          <- GET /api/admin/orders
│   │   │       ├── orders/[id]/route.ts     <- GET/PATCH /api/admin/orders/[id]
│   │   │       ├── products/route.ts        <- GET/POST /api/admin/products
│   │   │       ├── products/[id]/route.ts   <- PATCH/DELETE /api/admin/products/[id]
│   │   │       ├── stitching/route.ts       <- GET stitching kanban data
│   │   │       └── upload-image/            <- Cloudinary upload
│   │   └── unauthorized/page.tsx
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── AdminHeader.tsx
│   │   │   ├── StitchingKanbanBoard.tsx
│   │   │   ├── StitchingKanbanCard.tsx
│   │   │   ├── TailorJobCard.tsx
│   │   │   ├── dashboard/DashboardClient.tsx
│   │   │   └── inventory/
│   │   │       ├── InventoryPageClient.tsx
│   │   │       ├── RestockModal.tsx
│   │   │       └── AddProductDrawer.tsx
│   │   ├── account/
│   │   │   ├── AccountClient.tsx
│   │   │   ├── OrderListClient.tsx
│   │   │   ├── OrderTrackingClient.tsx
│   │   │   ├── MeasurementsListClient.tsx
│   │   │   ├── AddressesListClient.tsx
│   │   │   └── NotificationsClient.tsx
│   │   ├── checkout/
│   │   │   ├── CheckoutPageClient.tsx       <- Full checkout (33KB)
│   │   │   ├── CheckoutForm.tsx
│   │   │   └── OrderSummary.tsx
│   │   ├── layout/
│   │   │   ├── TopCategoryBar.tsx           <- Sticky top nav with search + cart
│   │   │   ├── BottomNav.tsx               <- Mobile bottom navigation
│   │   │   └── Footer.tsx
│   │   ├── landing/LandingClient.tsx
│   │   └── ui/                              <- shadcn/ui components
│   ├── models/
│   │   ├── Product.ts                       <- Discriminator pattern
│   │   ├── Order.ts                         <- Orders with embedded stitching
│   │   ├── User.ts                          <- Clerk ID + addresses + wishlist
│   │   ├── Cart.ts                          <- Defined but not used
│   │   └── UserMeasurementProfile.ts
│   ├── store/
│   │   ├── useCartStore.ts                  <- Zustand cart (localStorage)
│   │   ├── useMeasurementFormStore.ts
│   │   └── useStitchingStore.ts
│   ├── lib/
│   │   ├── db.ts                            <- MongoDB connection (cached)
│   │   ├── cloudinary.ts
│   │   ├── razorpay.ts
│   │   ├── rateLimit.ts
│   │   ├── slugify.ts
│   │   ├── notifications/
│   │   │   ├── email.ts                     <- Resend wrappers (WORKING)
│   │   │   └── whatsapp.ts                  <- ARCHIVED (no-ops)
│   │   └── validations/
│   ├── types/
│   │   ├── product.ts                       <- AnyProduct union type
│   │   └── cart.ts
│   ├── scripts/seed.ts
│   └── middleware.ts                        <- Clerk route protection
├── emails/                                  <- React Email templates
│   ├── OrderConfirmationEmail.tsx
│   ├── StitchingStartedEmail.tsx
│   ├── StitchingReadyEmail.tsx
│   └── OrderDispatchedEmail.tsx
├── public/
├── package.json
├── next.config.js
├── tailwind.config.ts
└── .env.local
```

---

## 5. Routing Architecture

### CRITICAL BUG: Admin pages are at wrong URLs

The `(admin)` route group in Next.js **strips the parenthetical from URLs**. This means:

| What's in code | CURRENT (broken) URL | CORRECT (wanted) URL |
|----------------|----------------------|----------------------|
| `(admin)/dashboard/page.tsx` | `/dashboard` | `/admin/dashboard` |
| `(admin)/orders/page.tsx` | `/orders` | `/admin/orders` |
| `(admin)/inventory/page.tsx` | `/inventory` | `/admin/inventory` |
| `(admin)/production/page.tsx` | `/production` | `/admin/production` |

**Fix:** Create directory `src/app/(admin)/admin/` and move all route folders inside it:
```
src/app/(admin)/admin/dashboard/page.tsx  -> serves /admin/dashboard
src/app/(admin)/admin/orders/page.tsx     -> serves /admin/orders
src/app/(admin)/admin/inventory/page.tsx  -> serves /admin/inventory
src/app/(admin)/admin/production/page.tsx -> serves /admin/production
```

The `AdminSidebar.tsx` already uses correct `/admin/*` hrefs. After fix, sidebar links will work.

### Root page is the Landing Page
`/` -> `app/page.tsx` — This is the **marketing/landing page**, not the store. It has its own inline CSS, animations, custom cursor, and pricing table. Does NOT use the store layout (no TopCategoryBar, no BottomNav).

### Store Homepage
`/home` -> `(store)/home/page.tsx` — The actual store product-browsing homepage.

---

## 6. Database Models

### Product (`src/models/Product.ts`) — Discriminator Pattern
Base model: `Product`, discriminator key: `type`

**Base fields:** `name`, `description`, `category` (mens/womens/kids/accessories), `subcategory`, `type`, `price`, `slug` (unique), `images[]`, `featured`, `active`, `tags[]`

**Discriminator `readymade`:**
- `sizeStock: { S, M, L, XL, XXL }` — quantity per size
- `material`, `color`

**Discriminator `fabric`:**
- `stockInMeters`, `pricePerMeter`, `fabricType`, `width` (inches)
- `texture` (Cloudinary URL), `stitchingAvailable` (bool), `stitchingPrice`
- `suitableFor[]`

**Discriminator `accessory`:**
- `stock` (simple count), `material?`, `color?`

### Order (`src/models/Order.ts`)

**Order-level:** `userId` (Clerk string), `orderNumber` (auto FB2506XXXXX), `items[]`, `subtotal`, `tax`, `shippingCost`, `totalAmount`, `shippingAddress` snapshot, `status` (pending/confirmed/processing/shipped/delivered/cancelled), `paymentStatus`, `paymentMethod`, tracking fields

**Order Item:** `itemType` (readymade/fabric/accessory), snapshot fields, type-specific fields, optional `stitchingDetails` (measurements, stitchingPrice, adminNotes, status: pending/cutting/stitching/quality_check/ready/delivered)

### User (`src/models/User.ts`)
`clerkId?` (sparse), `email`, `name`, `role` (customer/admin), `addresses[]`, `wishlist[]`, `notificationPreferences`

### UserMeasurementProfile (`src/models/UserMeasurementProfile.ts`)
`userId` (Clerk ID), `profileName`, `measurements` (length/shoulder/sleeve/chest/waist/neck etc.), `preferences?` (neckType/fitPreference/cuffType), `garmentTypes[]`, `isDefault`

---

## 7. API Routes (Complete Map)

### Public APIs

| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/products` | Query: `?category=`, `?type=`, `?featured=true`, `?search=` |
| GET | `/api/products/[id]` | Single product |
| POST | `/api/orders` | Place order |
| GET | `/api/orders/[id]` | Get order (customer) |
| POST | `/api/checkout/create-razorpay-order` | Create Razorpay order |
| POST | `/api/checkout/verify-payment` | Verify Razorpay signature |
| POST | `/api/checkout/place-order` | Finalize order after payment |

### Protected Customer APIs (Clerk auth required)

| Method | Endpoint |
|--------|----------|
| GET/PATCH | `/api/user/profile` |
| GET/POST/PATCH/DELETE | `/api/user/addresses` |
| GET | `/api/user/orders` |
| GET/POST/PATCH/DELETE | `/api/user/measurements` |
| GET/PATCH | `/api/user/notifications` |
| GET/POST/DELETE | `/api/user/wishlist` |

### Admin APIs (`publicMetadata.role === 'admin'` required)

| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/admin/analytics` | Dashboard metrics + revenue chart |
| GET | `/api/admin/orders` | All orders; `?filter=pending\|processing\|delivered` |
| GET/PATCH | `/api/admin/orders/[id]` | Order detail + status update |
| GET/POST | `/api/admin/products` | List all / Create product |
| PATCH/DELETE | `/api/admin/products/[id]` | Edit / Soft-delete product |
| GET | `/api/admin/stitching` | Kanban board data |
| POST | `/api/admin/upload-image` | Cloudinary image upload |

---

## 8. State Management (Zustand)

File: `src/store/useCartStore.ts`
Persisted to `localStorage` with key `fabloom-cart-storage`

### Cart Item Types:
```typescript
ReadymadeCartItem  { id, itemType:'readymade', productId, name, image, size, quantity, price }
FabricCartItem     { id, itemType:'fabric', productId, name, image, meters, pricePerMeter, fabricType, totalPrice }
StitchingCartItem  { id, itemType:'stitching', fabricId, meters, pricePerMeter, garmentType, stitchingCharge, measurementProfileId, measurementSnapshot, totalPrice }
AccessoryCartItem  { id, itemType:'accessory', productId, name, image, color?, quantity, price }
```

**ID strategy:**
- Readymade: `${productId}-${size}`
- Fabric: `${productId}-fabric`
- Stitching: `${productId}-stitching-${Date.now()}` (always unique)
- Accessory: `${productId}`

---

## 9. Auth & Middleware

File: `src/middleware.ts`

**Protected customer routes** (require Clerk login):
`/account(.*)`, `/wishlist(.*)`, `/cart(.*)`, `/checkout(.*)`, `/api/user(.*)`, `/api/measurements(.*)`

**Admin routes** (require `role=admin`):
`/admin(.*)`, `/api/admin(.*)`, plus currently `/dashboard(.*)`, `/orders(.*)`, `/production(.*)`, `/inventory(.*)` (these last four will be unnecessary after fixing the routing bug)

**Role check in middleware:**
```typescript
let role = sessionClaims?.role || sessionClaims?.publicMetadata?.role || sessionClaims?.metadata?.role;
// Falls back to Clerk API call if no role in session claims
const user = await client.users.getUser(userId);
role = user?.publicMetadata?.role;
```

**Admin layout also checks role:**
- `user.publicMetadata?.role === 'admin'` OR
- email is in hardcoded allowlist: `muhammedsuhail6444@gmail.com`

**To grant admin in Clerk:** Dashboard -> Users -> select user -> Public Metadata -> `{"role": "admin"}`

---

## 10. What Is FULLY Working

### Store:
- Landing page `/` — premium animated design, pricing table, CTA
- Store nav — TopCategoryBar (sticky), BottomNav (mobile), Footer
- `/fabrics` — lists fabrics from DB
- `/readymade` — lists readymade garments
- `/accessories`, `/caps`, `/perfumes` — basic listing pages
- `/stitching`, `/about`, `/search` — content pages
- `/cart` — works for logged-in users
- `/checkout` — Razorpay + COD flow
- `/wishlist` — full wishlist with API
- `/account` and all sub-pages (orders, measurements, addresses, notifications)
- Clerk sign in / sign up

### Admin:
- Sidebar + header shell
- Dashboard with Recharts analytics
- Orders list with filter/search
- Order detail with status update
- Stitching Kanban board (drag-and-drop)
- Inventory management (list, toggle active, restock, add product drawer)

### Backend:
- All admin APIs secured with Clerk role check
- Email templates (React Email + Resend)
- Rate limiting (Upstash Redis)
- Cloudinary image upload
- Analytics endpoint with 7-day revenue data

---

## 11. What Is PARTIALLY Built

| Feature | Done | Missing |
|---------|------|---------|
| Admin product management | List, restock, basic add drawer | Dedicated `/admin/products/new` page (empty), no full edit page |
| Email notifications | Templates + Resend wired | Not triggered on key events (order placed, stitching status change) |
| Search | Page exists | Full-text quality not verified |
| Checkout | Razorpay flow built | Needs end-to-end verification |

---

## 12. What Is MISSING / Broken

### CRITICAL (fix first)

**Bug 1 — Admin URL routing:** All admin pages serve at wrong paths. See Section 5.

**Bug 2 — Middleware role field:** Line 45 of `middleware.ts` reads `?.metadata?.role` which is wrong. Should be `(sessionClaims?.publicMetadata as any)?.role`.

**Bug 3 — Cart blocks guests:** `src/app/(store)/cart/page.tsx` redirects to `/sign-in` if no user. Guests should be able to view cart (they sign in at checkout). Remove the `currentUser()` guard from cart page.

**Bug 4 — Stock not deducted:** Placing an order doesn't decrement `sizeStock`, `stockInMeters`, or `stock`.

### Missing Admin Pages (sidebar links 404)

| Sidebar Link | Route Needed |
|--------------|-------------|
| Analytics | `/admin/analytics` |
| Customer List | `/admin/customers` |
| Measurement Profiles | `/admin/measurements` |
| Store Settings | `/admin/settings` |
| Shipping Settings | `/admin/settings/shipping` |
| Notification Settings | `/admin/settings/notifications` |
| Add Product page | `/admin/products/new` |

### Missing Customer Features

- Product detail pages (no `/readymade/[slug]` or `/fabrics/[slug]`)
- WhatsApp notifications (WATI archived, all functions are no-ops)
- Email on order placement not confirmed to fire in production
- Admin: Edit existing product (images, description) — only restock exists

---

## 13. Known Bugs

1. Admin pages at wrong URLs (`/dashboard` instead of `/admin/dashboard`, etc.)
2. Middleware reads wrong Clerk session claim field for role
3. Cart page blocks guest users
4. Order placement doesn't decrement product stock
5. WhatsApp module is entirely no-ops
6. `userId` in order creation — verify it saves Clerk user ID, not a placeholder

---

## 14. Priority Task List

### Phase 1 — Critical Fixes

- [ ] Fix admin URL routing — create `src/app/(admin)/admin/` subdirectory, move all admin route folders inside
- [ ] Fix `src/app/(admin)/admin/page.tsx` — redirect `/admin` to `/admin/dashboard`
- [ ] Fix middleware role check — `src/middleware.ts` line 45
- [ ] Fix middleware admin route matcher — remove dead path patterns after routing fix
- [ ] Fix cart guest access — remove `currentUser()` redirect from `src/app/(store)/cart/page.tsx`

### Phase 2 — Missing Admin Pages

- [ ] `/admin/analytics` — analytics charts page
- [ ] `/admin/customers` — list users from MongoDB
- [ ] `/admin/measurements` — view all measurement profiles
- [ ] `/admin/products/new` — full product creation form with Cloudinary upload
- [ ] `/admin/settings` — store settings page
- [ ] `/admin/settings/shipping` — shipping config
- [ ] `/admin/settings/notifications` — notification settings

### Phase 3 — Product Detail Pages

- [ ] `/readymade/[slug]` — image gallery, size selector with stock display, add to cart
- [ ] `/fabrics/[slug]` — meters selector, stitching option with measurement modal, add to cart
- [ ] Generic product detail for accessories/caps/perfumes

### Phase 4 — Backend Fixes

- [ ] Stock deduction in `POST /api/orders` using `$inc` on `sizeStock`/`stockInMeters`/`stock`
- [ ] Verify `userId` in orders is Clerk user ID
- [ ] End-to-end Razorpay test

### Phase 5 — Notifications

- [ ] Call `sendOrderConfirmationEmail()` when order is placed
- [ ] Call `sendStitchingStartedEmail()` when stitching status changes to `cutting`
- [ ] Call `sendStitchingReadyEmail()` when status changes to `ready`

---

## 15. Component Inventory

### Admin Components

| Component | Purpose | Status |
|-----------|---------|--------|
| `AdminSidebar.tsx` | Collapsible nav (dark navy, gold accent) | Complete |
| `AdminHeader.tsx` | Top bar with breadcrumbs | Complete |
| `DashboardClient.tsx` | Analytics with Recharts | Complete |
| `InventoryPageClient.tsx` | Product inventory table with SWR | Complete |
| `RestockModal.tsx` | Restock stock counts | Complete |
| `AddProductDrawer.tsx` | Quick add drawer | Basic (needs improvement) |
| `StitchingKanbanBoard.tsx` | Drag-drop stitching board | Complete |
| `TailorJobCard.tsx` | Printable job card | Complete |

### Customer Components

| Area | Components | Status |
|------|-----------|--------|
| Account | AccountClient, OrderListClient, OrderTrackingClient | Complete |
| Account | MeasurementsListClient, AddressesListClient, NotificationsClient | Complete |
| Checkout | CheckoutPageClient, CheckoutForm, OrderSummary | Complete |
| Layout | TopCategoryBar, BottomNav, Footer | Complete |

---

## 16. Coding Conventions

1. **Server Components by default** — Only add `'use client'` when needed.
2. **Admin API auth pattern:**
   ```typescript
   const { userId } = await auth();
   const user = await currentUser();
   if (!userId || user?.publicMetadata?.role !== 'admin') {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }
   ```
3. **Always call `await dbConnect()` before any DB query.**
4. **Use `.lean()` for read queries** (performance).
5. **Admin visual style:** Dark navy `#0f1035` sidebar, gold `#D4A853` accents.
6. **Store visual style:** White cards on dark navy, emerald/gold accents.
7. **Admin data fetching:** Use SWR in client components.
8. **Cart:** Use `useCartStore` from `@/store/useCartStore`.
9. **Next.js 15 async params:** `const { id } = await params;` — params are async!
10. **Admin pages:** Add `export const dynamic = 'force-dynamic';` to prevent caching.
11. **Pattern:** Server page (`page.tsx`) delegates to a `*Client.tsx` for client-side interactivity.

---

## 17. How to Run Locally

```bash
# cd to project folder
npm run dev          # Dev server at http://localhost:3000
npm run build        # Production build
npm run lint         # ESLint
npm run seed         # Seed MongoDB with sample products
```

---

## 18. Admin Panel Access

**Currently broken URL** (routing bug): Trying `/admin` goes to landing page redirect.
**Actual working URL** (broken path): `/dashboard` (wrong — served by `(admin)/dashboard/page.tsx`)

**After fixing routing bug:**
- Admin dashboard: `https://fablooom.vercel.app/admin/dashboard`
- Admin orders: `https://fablooom.vercel.app/admin/orders`

**Admin credentials:** Sign in with `muhammedsuhail6444@gmail.com`  
The layout has a hardcoded email fallback so even without Clerk metadata it works.

---

## 19. What Gemini Should Do Next

**Step 1:** Read this entire document.

**Step 2:** Fix Phase 1 bugs in this exact order:
1. Fix admin routing (move folders into `(admin)/admin/` subdirectory)
2. Add redirect page at `(admin)/admin/page.tsx`
3. Fix middleware role check (1 line change)
4. Clean up middleware matcher
5. Remove guest redirect from cart page

**Step 3:** Run `npm run dev`, test admin panel at `/admin/dashboard`

**Step 4:** Build missing admin pages one by one (Phase 2)

**Step 5:** Build product detail pages (Phase 3)

**Step 6:** Fix backend stock deduction (Phase 4)

**Step 7:** Wire email notifications (Phase 5)

---

**Code is the source of truth. If this document conflicts with actual files, trust the code.**

*Last updated: 2026-06-20 by Antigravity AI*
