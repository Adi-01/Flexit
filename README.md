# 👕 Flexit Clothing App — Frontend (React Native + Expo)

This is the **React Native frontend** for **Flexit**, a mobile-first clothing e-commerce application built using **Expo Router**, **TanStack Query**, and a modular, utility-first UI. It integrates with a Django REST Framework backend and offers a seamless shopping experience tailored for fashion lovers.

---

## 🎥 Demo Video

<video src="https://github.com/user-attachments/assets/747a5e59-63e4-4d93-adb7-be4789222789" width="100%" controls />


---

## 🚀 Tech Stack

- **Framework:** React Native + [Expo Router](https://expo.dev/router)
- **API Handling:** Axios + [TanStack Query](https://tanstack.com/query/latest)
- **Styling:** Tailwind CSS via [NativeWind](https://www.nativewind.dev/)
- **Navigation:** File-based routing with Expo Router
- **State Management:** React Context + Hooks
- **Storage:** [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/) for auth/session persistence
- **UI Enhancements:** `react-native-modal`, `expo-checkbox`, `ImagePicker`, etc.

---

## 🎯 Features Implemented

### 🔐 OTP Authentication

- Email-based OTP login
- Resend OTP after 60s cooldown
- Change email option on OTP screen
- Disabled button during network calls

---

### 👤 User Profile

- Upload avatar using **Expo ImagePicker**
- Avatars stored via backend media
- Managed via `AuthContext`

---

### 📍 Address Management

- Add, edit, delete addresses
- Toggle `is_default` with only one default enforced
- Active address shown during checkout

---

### 🛍️ Product UI

- Product cards: thumbnail, brand, price, discount
- Product Detail page:
  - Image gallery
  - Color & size variant selection
  - Expandable details, brand info, and reviews
- Responsive mobile layout using Tailwind (NativeWind)

---

### 💖 Wishlist / Saved Products

- Like toggle to save/remove products
- Saved items screen with confirmation-based delete

---

### 🔎 Hybrid Search System

- Debounced suggestions via `/suggest-titles/`
- Full keyword search via `/search/`
- User-friendly UX with clear input, loading state, and fallback

---

### 🛒 Cart System

- Add to cart from product detail (variant required)
- Quantity controls (`+` / `-`)
- List view with:
  - Product info
  - Color & size chips
  - Price and discount
  - Image
- Checkbox selection for checkout
- Checkout button appears only when items are selected

---

### 💳 Payments & Orders ✅

- Integrated **Stripe PaymentSheet** for secure in-app payment
- Real-time order creation upon successful payment
- Orders include:
  - Product details (with variant info)
  - Quantity, total price, payment status
  - Linked address and order date

---

### 📦 Order History ✅

- Orders listed by date with summary
- Tap on order to view full detail:
  - Items, quantity, price, delivery address, and status
- Display formatted timestamps and total bill amount

---

### 🎛️ Filters & Sorting

- Full-screen modal filter interface
- Filterable by: Category, Brand, Color, Size, Target Audience
- Reset & Apply options
- Powered by backend `/products/filters/` API

---

### 🏠 Home Screen

- Top header with:
  - Search input
  - Cart icon (UI)
- Placeholder for featured and trending products

---

## 📦 API Handling with TanStack Query

All API interactions are handled with **TanStack Query**, enabling:

* 🔁 Automatic background refetch
* 🌟 Cache-first data access
* 🚀 Optimistic updates (cart actions, wishlist, etc.)
* 🔥 Real-time UI syncing with server

```tsx
const { data, isLoading } = useQuery({
  queryKey: ["cart"],
  queryFn: fetchCart,
});
```

---

## 🔗 Backend Repo

> [🔗 Flexit Backend (Django + DRF)](https://github.com/Adi-01/Flexit-Backend)

---

## 🛠️ Modular Component Structure

```ts
ProductCard, SearchBar, LikeButton
ProductVariants, AddToCartControls
CartActions (for quantity management)
CustomModal, FilterModal
useDebounce hook
Organized with clean reusable structure
```

---

## 🧪 Dev Instructions

```bash
# Install dependencies
npm install

# Start the Expo server
npx expo start
```

Update `.env` or Axios base URL to point to your Django backend API.

---

## 📄 License

This project is open-source under the MIT License.
