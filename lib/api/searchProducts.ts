// lib/api.ts or a suitable location
import axiosInstance from "@/lib/axiosInstance";

export const searchProducts = async (query: string) => {
  const res = await axiosInstance.get(
    `/products/search/?q=${encodeURIComponent(query)}`
  );
  return res.data;
};
