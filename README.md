# Flexit Clothing App — Frontend (React Native + Expo)

This is the **React Native frontend** for **Flexit**, a clothing e-commerce mobile application built using **Expo Router**, **TanStack Query**, and modular UI components. It integrates with a Django REST Framework backend and provides a seamless, mobile-first shopping experience.

---

## 🚀 Tech Stack

* **Framework:** React Native with [Expo Router](https://expo.dev/router)
* **API Handling:** Axios + [TanStack Query](https://tanstack.com/query/latest)
* **Styling:** Tailwind CSS (via `nativewind`)
* **Navigation:** File-based routing with Expo Router
* **State Management:** React Hooks + Context
* **UI Enhancements:** `react-native-modal`, `expo-checkbox`, `ImagePicker`, etc.

---

## 🎯 Features Implemented

### 🔐 OTP-based Authentication

* Login via email OTP
* "Send OTP" with disabled button during request
* Resend OTP with 60-second cooldown
* Display sent email with clickable "Change" option

---

### 🧑 User Profile

* Profile avatar upload using **Expo ImagePicker**
* Avatar stored via backend media support
* Uses `AuthContext` for user data

---

### 📍 Address Management

* Add, edit, and delete addresses
* Support for multiple addresses per user
* Only one `is_default` address enforced via UI toggle

---

### 🛍️ Product UI

* Product card component:

  * Thumbnail, title, brand, price, discount
* Product detail page:

  * Image gallery with fade on scroll
  * Variant selection (color & size)
  * Brand navigation
  * Reviews section
  * Expandable product details
* Responsive styling with Flexbox and dark mode theme

---

### 💖 Wishlist / Saved Products

* Toggle saved products (via LikeButton)
* Saved products screen
* Delete saved items with confirmation modal

---

### 🧠 Hybrid Search System

* **Keyword suggestion (debounced)**

  * `/suggest-keywords/` API integration
* **Full search with results**

  * `/search/` API integration
* Smart UI:

  * Loading state
  * "No results" fallback
  * "Showing results for..." label
  * Clearable input with `X`

---

### 🛒 Full Cart System ✅

* Add to cart from **Product Detail** screen (after selecting color + size)
* Quantity controls (`+`/`-`) inside cart screen
* Uses backend-safe cart item structure (`product`, `color_variant`, `size_variant`)
* Cart items are displayed in a list with:

  * Image
  * Product details
  * Price, discount, original price
  * Color & size chips
  * Selection checkbox for checkout
* Conditional checkout button:

  * Only visible when at least one item is selected

---

### 🎛️ Product Filtering & Sorting ✅

* Modal-based full-screen filter UI
* Categories shown on left; values on right
* Filterable options:

  * Category, Brand, Color, Size, Target Audience
* Reset and Apply buttons
* Backend-driven filter values via `/products/filters/`

---

### 🏠 Home Screen

* Top header with:

  * Search bar
  * Cart icon (currently UI only)
* Space for featured/popular products (planned)

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

## ✨ Planned Enhancements

* Push notifications
* Order history screen
* Cart persistence across sessions
* Lazy loading and pagination
* Animations for transitions

---

## 📄 License

This project is open-source under the MIT License.
