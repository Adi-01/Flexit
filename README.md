# 🛍️ Flexit Clothing App

Flexit is a modern clothing e-commerce app built using **Django REST Framework** for the backend and **React Native with Expo Router** for the frontend. It features a fully functional shopping experience including authentication, product browsing, wishlist, cart management, address support, and more.

---

## 🚀 Tech Stack

- **Frontend:** React Native + Expo Router
- **Backend:** Django REST Framework (DRF)
- **API Handling:** Axios + TanStack Query (React Query)
- **Image Handling:** Expo ImagePicker, Django Media Files
- **Database:** SQLite (dev) / PostgreSQL (prod-ready)
- **Authentication:** OTP-based email login

---

## ✅ Features Overview

### 1. 🔐 Authentication & Onboarding

- OTP-based login system
  - Send OTP with disabled button during request
  - 60-second resend timer
  - Display email with option to change
- Onboarding screen for new users

---

### 2. 👤 User Profile

- Custom `User` model in Django
- Image upload support for avatar (device image picker)
- Frontend integration with Expo ImagePicker

---

### 3. 📍 Address Management

- Separate `Address` model (1 user → multiple addresses)
- Add, edit, delete address support
- Enforces one default address using `is_default` flag

---

### 4. 🛒 Product Management

- Product structure:
  - Title, brand, category, description
  - Price, discount, calculated final price
  - Total stock auto-computed
- `ProductColorVariant`:
  - Color options with thumbnail + images
  - Size and stock mapping per color
- Serializer usage:
  - `ProductListSerializer` for light queries
  - `ProductSerializer` for detailed view

---

### 5. 💖 Wishlist / Saved Products

- Save/un-save products to wishlist
- Saved products screen with card layout
- Deletion with confirmation modal

---

### 6. 🎨 Product UI & UX

- ProductCard component for grid display
- Product detail screen with:
  - Image gallery
  - Variant selector (color, size)
  - Brand link, pricing, reviews, and descriptions
- Clean dark-themed UI
- Responsive layout using Flexbox

---

### 7. 🏠 Home Screen

- Header includes:
  - Search bar with navigation
  - Cart icon with indicator
- Space for featured/popular products

---

### 8. 🔍 Hybrid Search System

- `/products/search/` → full product search
- `/products/suggest-keywords/` → suggestion endpoint
- Debounced keyword suggestions as user types
- Manual search on enter or selection
- "Showing results for..." UX
- Full result screen with fallback for no results

---

### 9. 🎯 Product Filtering & Sorting ✅

- Filter by:
  - Category, Brand, Color, Size, Target Audience
- Sorting options (price, popularity, etc.)
- Modal-based UI with selectable chips
- Backend-powered dynamic filter options

---

### 10. 🧺 Full Cart System ✅

- Add to cart with variant selection
- Quantity management per cart item
- Cart summary with pricing and discount
- Select items for checkout using checkboxes
- Persistent cart for each user

---

## 🧠 TanStack Query for API Management

Flexit leverages **TanStack Query (React Query)** for:

- Data fetching, caching, and revalidation
- Stale-while-revalidate strategies
- Query invalidation on mutations (e.g., cart updates, wishlist changes)
- Optimistic UI updates and background sync
- Seamless pagination and infinite scrolling (planned)

Example:

```ts
const { data, isLoading } = useQuery({
  queryKey: ["products"],
  queryFn: fetchProducts,
});
