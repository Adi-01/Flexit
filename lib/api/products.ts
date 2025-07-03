import { Product } from "@/types/interface";
import axiosInstance from "../axiosInstance";

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await axiosInstance.get<Product[]>(
      "/products/all/?in_stock=True"
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || "Failed to fetch products");
  }
};
