# Fabloom - Project Overview
> Last updated: 2026-02-22

## What is Fabloom?
An e-commerce platform for **premium Islamic clothing** — selling readymade garments, fabrics (sold by meter), and offering a **custom stitching service** where customers submit measurements and a tailor stitches their garment.

**Stack:** Next.js 14 (App Router) · MongoDB (Mongoose) · Clerk (Auth) · Zustand (Cart State) · TailwindCSS · shadcn/ui

---

## ✅ Fully Done

### Pages
| Page | Route | Notes |
|------|-------|-------|
| Home | `/` | Hero, feature cards, CTA sections |
| Readymade Products | `/products` | Lists all readymade garments from DB |
| Fabrics | `/fabrics` | Lists fabric products with stitching info section |
| Product Detail | `/products/[id]` | Gallery, size selector, meter selector, add to cart |
| Cart | `/cart` | View/remove items, cart summary with tax |
| Checkout | `/checkout` | Shipping form (zod validation), COD payment, places order |
| Order Success | `/checkout/success` | Confirmation page after placing order |
| Admin Dashboard | `/admin` | Stats cards, quick actions |
| Admin Orders List | `/admin/orders` | Table of all orders with search & filter |
| Admin Order Detail | `/admin/orders/[id]` | Customer info, items, order status dropdown, stitching status dropdowns per item, printable tailor job card |

### APIs
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/products` | GET | Fetch all products (filter by category, type, featured) |
| `/api/products/[id]` | GET | Fetch single product |
| `/api/orders` | POST | Place a new order |
| `/api/orders/[id]` | GET | Get single order |
| `/api/admin/orders` | GET | Fetch all orders for admin (filter: all/stitching/completed) |
| `/api/admin/orders/[id]` | GET | Get full order detail for admin |
| `/api/admin/orders/[id]` | PATCH | Update order status or per-item stitching status |

### Database Models
| Model | File | Notes |
|-------|------|-------|
| Product | `Product.ts` | Readymade, fabric, accessory types; images, stock, stitching config |
| Order | `Order.ts` | Items with embedded stitching details per item, shipping address, order status |
| User | `User.ts` | Clerk ID sync, addresses, role |
| Cart | `Cart.ts` | Server-side cart model (defined but not used — Zustand handles cart) |
| UserMeasurementProfile | `UserMeasurementProfile.ts` | Measurement profile schema (defined, no UI built yet) |

### Components
- **Layout:** Navbar (with cart icon, user controls), Footer
- **Product:** ProductCard, ProductGallery, ProductInfo, StitchingModal
- **Cart:** CartItemCard, CartSummary
- **Checkout:** CheckoutForm
- **Admin:** TailorJobCard (printable), Admin sidebar with navigation

### Auth (Clerk)
- Login/signup fully working
- Middleware protects `/admin/*` and `/profile/*`
- Order placement syncs Clerk user to MongoDB automatically (silent fail — never blocks the order)

### Cart (Zustand)
- Persisted to `localStorage`
- Supports readymade (by size), fabric (by meters), accessory
- Custom stitched fabric items are each treated as unique entries

---

## 🔧 Partially Done

### 1. Products Filtering
- `/products` page has a **"Filter Products" button** rendered in the UI but it has no action attached — no filter/sort functionality behind it

### 2. UserMeasurementProfile
- Mongoose model is defined (`UserMeasurementProfile.ts`) but there is **no API route and no UI** to create, view, or use saved measurement profiles
- The StitchingModal does not load saved profiles — customers enter measurements manually every time

---

## ❌ Not Built Yet

| Feature | Notes |
|---------|-------|
| `/stitching` page | Navbar links to it but the page does not exist (404) |
| `/about` page | Navbar links to it but the page does not exist (404) |
| `/profile` page | Protected in middleware but the page does not exist |
| User order history | No page for customers to view their past orders |
| Saved measurement profiles UI | Model exists; API and UI not built |
| Admin product management | No way to add/edit/delete products from admin panel |
| Admin customers page | Sidebar has "Customers" link but page does not exist |
| Stock deduction on order | Stock fields exist in model but no deduction happens when an order is placed |
| Email notifications | No order confirmation emails sent |
| Payment gateway | Only Cash on Delivery; card option is a disabled placeholder |
| Search | Search icon in navbar has no functionality |

---

## 🗂️ File Structure

```
src/
├── app/
│   ├── page.tsx                  ✅ Home
│   ├── layout.tsx                ✅ Root layout
│   ├── products/                 ✅ Products listing + detail
│   ├── fabrics/                  ✅ Fabrics listing
│   ├── cart/                     ✅ Cart page
│   ├── checkout/                 ✅ Checkout + success
│   ├── admin/                    ✅ Admin dashboard, orders list, order detail
│   ├── (auth)/                   ✅ Clerk auth layout
│   └── api/                      ✅ All API routes
├── components/
│   ├── layout/                   ✅ Navbar, Footer
│   ├── product/                  ✅ Cards, gallery, info, stitching modal
│   ├── cart/                     ✅ Cart item, summary
│   ├── checkout/                 ✅ Checkout form
│   ├── admin/                    ✅ TailorJobCard
│   └── ui/                       ✅ shadcn/ui components
├── models/                       ✅ 5 Mongoose models
├── store/                        ✅ Zustand cart store
├── lib/                          ✅ DB connection, validations, utilities
└── middleware.ts                  ✅ Route protection
```

---

## 🔑 Environment Variables (.env.local)

```
MONGODB_URI=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
