# Fabloom: End-to-End Project Knowledge Base for Gemini

Last Updated: 2026-02-18  
Owner Repo: Fabloom  
Primary Use: This document is the authoritative AI handoff context for Gemini to understand implementation status, architecture, data contracts, current blockers, and update workflow.

---

## 0) How to Use This Document

- Read this file first before writing any status update.
- Treat source code as final source of truth if any section here conflicts with implementation.
- For every new progress report, append a new entry to `GEMINI_DAILY_LOG.md` (append-only).
- Do not claim work as complete unless file changes are already saved in the repository.

---

## 1) Product Definition (What Fabloom Is)

Fabloom is a hybrid Islamic fashion commerce system with three product paths:

1. **Readymade garments** (size-based inventory)  
2. **Fabrics sold by meter**  
3. **Custom stitching service** attached to fabric purchase

Core business promise:
- Sell ready-to-ship products and custom-tailored orders in the same checkout flow.
- Preserve stitching measurements in order snapshots for downstream tailoring execution.
- Provide admin-side per-item stitching status control.

---

## 2) Tech Stack and Runtime Baseline

### Framework and language
- Next.js App Router (`next@15.x`)
- React (`react@19`)
- TypeScript

### UI / styling
- Tailwind CSS + shadcn/ui primitives
- Custom theme tokens in `tailwind.config.ts` (`emerald`, `navy`, `gold` scales)
- Fonts: Inter (`--font-inter`) + Playfair Display (`--font-playfair`)

### Data and state
- MongoDB + Mongoose
- Zustand (`persist`) for client cart state in localStorage key `fabloom-cart-storage`

### Validation / forms
- React Hook Form + Zod

### Auth state (current)
- Customer auth: not fully integrated in runtime order flow
- Admin auth: MVP cookie gate in client layout (`admin_code=FABLOOM_ADMIN_2026`)
- Clerk package installed but only partially wired (UI TODO remains)

---

## 3) Current Route Map (Implemented vs Missing)

## Storefront pages (implemented)
- `/` (home)
- `/products`
- `/products/[id]`
- `/fabrics`
- `/cart`
- `/checkout`
- `/checkout/success/[id]`

## Admin pages (implemented)
- `/admin`
- `/admin/orders`
- `/admin/orders/[id]`

## API routes (implemented)
- `GET /api/products`
- `GET /api/products/[id]`
- `POST /api/orders`
- `GET /api/admin/orders`
- `GET /api/admin/orders/[id]`
- `PATCH /api/admin/orders/[id]`
- `POST /api/test-update` (debug/test route)

## API route gap (important)
- **Missing route:** `GET /api/orders/[id]`
- `src/app/checkout/success/[id]/page.tsx` currently calls this missing route, so order fetch on success page is not backed by existing API implementation.

## Navigation links with no implemented target pages
- Navbar links include `/stitching` and `/about`, but those pages are not present.

---

## 4) Data Model Deep Dive (Mongoose)

## 4.1 Product model (`src/models/Product.ts`)

### Base fields
- `name`, `description`, `category`, `subcategory`, `type`, `price`, `images`, `featured`, `active`, `tags`
- `type` is discriminator key: `readymade | fabric | accessory`

### Discriminator: readymade
- `sizeStock`: `S, M, L, XL, XXL`
- `material`, `color`

### Discriminator: fabric
- `stockInMeters`
- `pricePerMeter`
- `fabricType`
- `width`
- `texture`
- `stitchingAvailable`
- `stitchingPrice`

### Discriminator: accessory
- `stock`
- optional `material`, `color`

### Indexes
- `{ type, category, active }`
- `{ featured }`
- `{ tags }`

---

## 4.2 Order model (`src/models/Order.ts`)

### Order-level fields
- `userId` (required)
- `orderNumber` (required unique, indexed)
- `items[]`
- `subtotal`, `tax`, `shippingCost`, `totalAmount`
- `shippingAddress{ fullName, phone, addressLine1, addressLine2?, city, state, postalCode, country }`
- `status`: `pending | confirmed | processing | shipped | delivered | cancelled`
- `paymentStatus`: `pending | paid | failed | refunded`
- `paymentMethod`: `card | cod | upi`
- tracking fields (`trackingNumber`, `estimatedDeliveryDate`, `deliveredAt`)

### Order item shape
- `itemType`: `readymade | fabric | accessory`
- snapshot fields: `productId`, `productName`, `productImage`
- readymade/accessory fields: `size?`, `quantity?`, `price?`
- fabric fields: `meters?`, `pricePerMeter?`, `totalPrice?`
- optional `stitchingDetails` with measurements and per-item stitching status

### Stitching status values
- `pending | in_progress | completed | delivered`

### Order number generation
- Pre-validate hook auto-generates `FBYYMM#####` if missing.
- `POST /api/orders` also generates order number manually before save.
- **Note:** This is functional but redundant; there are two generation paths.

### Indexes
- `{ userId, createdAt: -1 }`
- `{ status, createdAt: -1 }`

---

## 4.3 Cart model (`src/models/Cart.ts`)

### Cart-level fields
- `userId` (unique)
- `items[]`
- `totalAmount`

### Behavior
- `CartItemSchema` is `{ _id: false }`.
- pre-save hook calculates totals:
  - readymade/accessory: `price * quantity`
  - fabric: `totalPrice` + stitching price (if enabled)

---

## 4.4 User model (`src/models/User.ts`)

- `clerkId?` (sparse unique)
- `email`, `name`, `phone?`, `role`, `avatar?`
- `addresses[]` with `isDefault`
- roles: `customer | admin`

---

## 4.5 Measurement profile (`src/models/UserMeasurementProfile.ts`)

- `userId`, `profileName`, `measurements`, `garmentType`, `isDefault`
- garment types: `kurta | thobe | shirt | pant | other`
- unique partial index enforces one default profile per `(userId, garmentType)`

---

## 5) Validation and Domain Rules

## 5.1 Checkout shipping validation (`src/lib/validations/order.ts`)

Required fields:
- `fullName`, `email`, `phone`, `address`, `city`, `postalCode`, `country`

Important mismatch:
- Zod expects `address`, but persisted order uses `shippingAddress.addressLine1`.
- Mapping currently happens manually in `POST /api/orders` (`address -> addressLine1`).

## 5.2 Measurement validation (`src/lib/validations/measurement.ts`)

- Styles: `Jubbah | Kurta | Shirt | Kandura`
- Numeric min/max rules for neck/chest/waist/shoulder/sleeve/shirt length
- Optional `notes` max 500 chars

Important mismatch:
- `measurementSchema` requires `waist`.
- `IFabricCartItem` custom measurements and some measurement model types may treat waist as optional in other contexts.

---

## 6) End-to-End Runtime Flows

## 6.1 Product browsing

- `/products` calls `GET /api/products` without type filter (currently includes all active product types from backend).
- `/fabrics` calls `GET /api/products?type=fabric`.
- `/products/[id]` server-fetches `GET /api/products/[id]` with `cache: no-store`.

### Note
- `/products` page title says “Readymade Garments” but API response is not type-restricted unless filtered in UI.

---

## 6.2 Add to cart behavior (client-side)

Store: `src/store/useCartStore.ts`

### ID strategy
- readymade: `${productId}-${size}`
- fabric with stitching: `${productId}-custom-${Date.now()}`
- others: `${productId}`

### Merge behavior
- Existing readymade and non-custom fabric items increment quantity.
- Custom stitched fabric entries are always unique.

### Pricing behavior
- Fabric item total = `(pricePerMeter * meters + stitchingPrice_if_any) * quantity`

---

## 6.3 Stitching flow

1. Product detail (`ProductInfo`) opens `StitchingModal` for stitchable fabric.
2. `MeasurementForm` captures style + measurements + notes.
3. On submit, fabric item with `stitchingDetails` is pushed to cart.

Current implementation detail:
- `StitchingModal` hardcodes `meters: 3` for stitched add-to-cart path.
- Non-stitched path uses user-selected meter input.

---

## 6.4 Checkout to order creation

1. `/checkout` gathers shipping form values.
2. POST body sent to `/api/orders` includes:
   - `shippingAddress`
   - `cartItems`
   - `subtotal`, `tax`, `total`
   - `paymentMethod: 'cod'`
3. API validates shipping and cart shape.
4. API snapshots cart items into order item schema.
5. API creates order and returns `{ orderId, orderNumber }`.
6. Client redirects to `/checkout/success/[orderId]`.

Current implementation constraints:
- `userId` is placeholder ObjectId (`000000...`) in order creation.
- `shippingAddress.state` is currently set from city (“city as state for now”).

---

## 6.5 Success page behavior

- On mount, success page clears cart.
- Then tries to fetch order by `GET /api/orders/[id]` (currently missing API route).
- If fetch fails, page still renders fallback using order ID param only.

---

## 6.6 Admin order management

### Orders list (`/admin/orders`)
- Pulls from `GET /api/admin/orders`.
- Supports filter query:
  - `all`
  - `stitching` (`items.stitchingDetails` exists)
  - `completed` (`status=delivered`)
- Client-side search by order number / customer name.

### Order detail (`/admin/orders/[id]`)
- Gets order by `GET /api/admin/orders/[id]`.
- Updates whole order status via `PATCH` body `{ status }`.
- Updates stitching item status via `PATCH` body `{ itemId, stitchingStatus }`.
- Renders printable tailor job cards for items with stitching details.

---

## 7) API Contract Summary

## 7.1 `GET /api/products`

Query params:
- `category`
- `type`
- `featured=true`

Returns:
- `success`, `count`, `data[]` (active products)

## 7.2 `GET /api/products/[id]`

Checks ObjectId format and returns one product.

## 7.3 `POST /api/orders`

Expected body:
- `shippingAddress`
- `cartItems[]`
- `subtotal`, `tax`, `total`
- optional `paymentMethod`

Response success payload:
- `data.orderId`
- `data.orderNumber`

## 7.4 `GET /api/admin/orders`

Optional query `filter` values:
- `stitching`
- `completed`

## 7.5 `GET /api/admin/orders/[id]`

Returns single order, includes console logging of item `_id` diagnostics.

## 7.6 `PATCH /api/admin/orders/[id]`

Modes:
1. Order status update (`{ status }`)
2. Stitching item update (`{ itemId, stitchingStatus }`, optional `status`)

Validation:
- Checks order id validity.
- Checks item id validity for stitching updates.
- Validates enum membership for status fields.

## 7.7 `POST /api/test-update`

Debug endpoint writing to `update-test-log.txt`.

Known issue:
- Throws `Cannot read properties of undefined (reading 'toString')` in item lookup when `_id` is absent in some item nodes.

---

## 8) Frontend Component Contracts

## Product details
- `ProductInfo` handles variant UX by product type.
- Fabric can be purchased with or without stitching.

## Cart
- `CartPage` uses Zustand store and hydration guard pattern.
- Stitching fees separately calculated for summary display.

## Checkout
- `CheckoutForm` validates with Zod.
- Payment UI is COD-first; card option present but disabled (“coming soon”).

## Admin
- `TailorJobCard` supports print formatting and shows measurement fields.
- Uses `item.stitchingDetails.style` display if present; defaults to “Custom”.

---

## 9) Security / Auth / Access Reality (Current State)

## Customer identity in orders
- Not integrated yet; order creator uses static placeholder `userId`.

## Admin protection
- Client-side cookie-based MVP (`FABLOOM_ADMIN_2026`).
- Not a hardened auth model; should be replaced with server-verified auth/authorization.

## Clerk integration
- Dependency present.
- Navbar still shows static user icon with TODO to replace by Clerk `UserButton`.

---

## 10) Data and Script Operations

## Seed (`npm run seed`)
- Populates 6 sample products:
  - 2 readymade
  - 2 fabric
  - 2 accessory

## Utility scripts
- `src/scripts/check-db.ts`: inspect products in DB
- `src/scripts/test-api.ts`: test `/api/products`
- `scripts/test-update.js`: direct DB stitching status update test
- `scripts/test-api-data.js`: inspect raw vs lean order item `_id`

---

## 11) Environment and Configuration

## Required runtime env
- `MONGODB_URI` (required by db connector)

## Referenced in docs / dependencies but not fully wired in core flow
- Clerk keys
- Cloudinary keys
- `NEXT_PUBLIC_APP_URL` (used for server-side fetch base URL in pages)

## Styling config highlights
- Theme tokens centralized in `tailwind.config.ts`
- Custom color palettes: `emerald`, `navy`, `gold`

---

## 12) Known Issues and Mismatches (Explicit)

1. **Missing API route:** `/api/orders/[id]` referenced by success page.
2. **Runtime bug:** `_id.toString()` crash in `src/app/api/test-update/route.ts`.
3. **Auth placeholder:** hardcoded `userId` in `POST /api/orders`.
4. **State mapping shortcut:** shipping `state` persisted as `city`.
5. **Potential double order-number generation:** model hook + route logic.
6. **Stitching meter inconsistency:** custom stitched add-to-cart defaults to `3m` in modal.
7. **Navbar dead links:** `/stitching`, `/about` routes not implemented.
8. **Admin nav dead links:** `/admin/products`, `/admin/customers` not implemented.

---

## 13) Priority Backlog (Most Impactful Order)

P0
1. Fix stitching item lookup robustness in `src/app/api/test-update/route.ts`.
2. Add `GET /api/orders/[id]` or adjust success page data strategy.
3. Replace placeholder `userId` with authenticated user source.

P1
4. Harden admin auth (server-side verification + role check).
5. Normalize shipping address mapping (`state`/`city` correctness).
6. Remove redundant order-number generation path.

P2
7. Align stitched-fabric meter handling between modal and product input.
8. Resolve or remove dead navigation links.

---

## 14) Gemini Update Protocol (Strict)

When asked for progress updates, Gemini must do the following in order:

1. Inspect source-of-truth files listed below.
2. Confirm what changed since last entry.
3. Append one new section to `GEMINI_DAILY_LOG.md` using the template.
4. Update this file only if architecture/status assumptions changed materially.

### Daily entry template (must follow exactly)

```md
## Progress Update - YYYY-MM-DD HH:mm (local)

### Completed Since Last Update
- ...

### In Progress
- ...

### Blockers / Errors
- ...

### Files Changed
- path/to/file
- path/to/file

### Validation Done
- Command(s) run:
- Result:

### Next 3 Actions
1. ...
2. ...
3. ...
```

### Non-negotiable update rules
- Only mark as completed when file edits are already saved.
- Include exact file paths.
- If tests/commands were not run, write **“Not run yet”** explicitly.
- Keep updates factual and implementation-grounded.

---

## 15) Source-of-Truth Files Gemini Must Check First

- `GEMINI_PROGRESS.md`
- `GEMINI_DAILY_LOG.md`
- `README.md`
- `update-test-log.txt`
- `test-response.json`
- `src/app/api/orders/route.ts`
- `src/app/api/admin/orders/route.ts`
- `src/app/api/admin/orders/[id]/route.ts`
- `src/app/api/test-update/route.ts`
- `src/store/useCartStore.ts`
- `src/models/Order.ts`
- `src/models/Product.ts`

---

## 16) Quick Commands

```bash
npm run dev
npm run build
npm run lint
npm run seed
```

---

If any section here diverges from implementation, code is source of truth and this file must be updated immediately.
