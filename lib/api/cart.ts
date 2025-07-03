// lib/api/cart.ts
import axiosInstance from "@/lib/axiosInstance";

export const fetchCart = async () => {
  const res = await axiosInstance.get("/users/cart/");
  return res.data;
};

export const addToCart = async ({
  product,
  color_variant,
  size_variant,
  quantity,
  replace,
}: {
  product: number;
  color_variant: number;
  size_variant: number;
  quantity: number;
  replace?: boolean;
}) => {
  const res = await axiosInstance.post("/users/cart/add/", {
    product,
    color_variant,
    size_variant,
    quantity,
    replace,
  });
  return res.data;
};

export const removeFromCart = async ({
  product,
  color_variant,
  size_variant,
}: {
  product: number;
  color_variant: number;
  size_variant: number;
}) => {
  const res = await axiosInstance.delete("/users/cart/remove/", {
    data: {
      product,
      color_variant,
      size_variant,
    },
  });
  return res.data;
};
