import icons from "./icons";

export const settings = [
  {
    title: "Edit Profile",
    icon: icons.editProfile,
    route: "/profile/edit-profile",
  },
  {
    title: "My Orders",
    icon: icons.orders,
    route: "/profile/my-orders",
  },
  {
    title: "Saved Address",
    icon: icons.savedAddress,
    route: "/profile/saved-address",
  },
  {
    title: "App Version",
    icon: icons.app,
    arrowShown: false,
  },
  {
    title: "Notifications",
    icon: icons.bell,
    route: "/profile/notifications",
  },
  {
    title: "Contact Us",
    icon: icons.contact,
    route: "/profile/contact-us",
  },
];

export const categories = [
  { category: "All", title: "All" },
  { category: "Men", title: "Men" },
  { category: "Women", title: "Women" },
  { category: "Kids", title: "Kids" },
  { category: "Shoes", title: "Shoes" },
  { category: "Accessories", title: "Accessories" },
  { category: "Vintage", title: "Vintage" },
  { category: "Luxury", title: "Luxury" },
  { category: "Streetwear", title: "Streetwear" },
];

export const dummyProducts = [
  {
    $id: "1",
    title: "Vintage Denim Jacket",
    price: "$25",
    image:
      "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?q=80&w=969&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    condition: "Gently Used",
  },
  {
    $id: "2",
    title: "Leather Handbag",
    price: "$40",
    image:
      "https://images.unsplash.com/photo-1691480250099-a63081ecfcb8?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    condition: "Like New",
  },
  {
    $id: "3",
    title: "Retro Sneakers",
    price: "$30",
    image:
      "https://images.unsplash.com/photo-1605523741177-cd660595c2cf?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    condition: "Good",
  },
  {
    $id: "4",
    title: "Oversized Sweater",
    price: "$15",
    image:
      "https://images.unsplash.com/photo-1667586680656-6b8e381cddb5?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    condition: "New",
  },
];
