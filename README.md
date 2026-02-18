# Fabloom - Islamic Clothing E-commerce Platform

A modern, premium e-commerce platform for Islamic clothing with a unique hybrid store model supporting:
- **Readymade Garments** (inventory tracked by size: S/M/L/XL/XXL)
- **Fabrics** (sold by meter with optional custom stitching)
- **Custom Stitching Services** (with reusable measurement profiles)

## 🎨 Design Theme

**Modern Islamic Elegance**
- Colors: Deep Emerald Green, Royal Navy, Gold Accents, Cream/Off-White
- Typography: Clean Sans-Serif (Inter) for UI
- Vibe: Trustworthy, Minimalist, High-End

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: MongoDB with Mongoose
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Auth**: Clerk (or NextAuth)
- **Images**: Cloudinary
- **Icons**: Lucide React

## 📁 Project Structure

```
fabloom/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── layout/      # Layout components
│   │   ├── product/     # Product-related components
│   │   ├── cart/        # Cart components
│   │   └── forms/       # Form components
│   ├── lib/             # Utilities
│   │   ├── db.ts        # MongoDB connection
│   │   └── utils.ts     # Helper functions
│   ├── models/          # Mongoose models
│   │   ├── Product.ts
│   │   ├── User.ts
│   │   ├── Cart.ts
│   │   ├── Order.ts
│   │   └── UserMeasurementProfile.ts
│   ├── store/           # Zustand stores
│   └── types/           # TypeScript types
```

## 🗄️ Database Schema

### Product Model (with Discriminators)
- **Base Product**: Common fields for all product types
- **Readymade**: Size-based stock tracking (S/M/L/XL/XXL)
- **Fabric**: Meter-based stock with stitching options
- **Accessory**: Simple stock count

### Cart Model
Handles mixed items:
- Readymade products with size selection
- Fabrics with optional stitching service
- Stitching linked to measurement profiles or custom measurements

### User Measurement Profile
Reusable measurement profiles for custom stitching:
- Neck, Chest, Shoulder, Sleeve Length, Shirt Length
- Multiple profiles per user (e.g., "For Me", "For Son")
- Default profile selection

### Order Model
Complete order tracking with:
- Mixed item support
- Stitching status per item
- Auto-generated order numbers (FB2602XXXXX format)
- Payment and shipping tracking

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Cloudinary account
- Clerk account (for authentication)

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
Create a `.env.local` file in the root directory:
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/fabloom

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3. **Run the development server**:
```bash
npm run dev
```

4. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Key Features

### Hybrid Product System
- **Readymade Products**: Traditional e-commerce with size variants
- **Fabric Sales**: Meter-based pricing and stock management
- **Stitching Service**: Optional add-on for fabric purchases

### Smart Cart Logic
- Handles all three product types simultaneously
- Automatic price calculation including stitching
- Measurement profile integration

### Measurement Profiles
- Save and reuse measurements
- Multiple profiles per user
- Quick selection during checkout

### Order Management
- Comprehensive order tracking
- Separate stitching status for custom orders
- Auto-generated unique order numbers

## 🎯 Next Steps

- [ ] Implement frontend components with shadcn/ui
- [ ] Build cart logic with Zustand
- [ ] Create measurement form with validation
- [ ] Integrate Clerk authentication
- [ ] Set up Cloudinary image uploads
- [ ] Create admin dashboard
- [ ] Add payment integration

## 📝 License

Private project for Fabloom Islamic Clothing Brand.

---

**Built with ❤️ for the Islamic community**
