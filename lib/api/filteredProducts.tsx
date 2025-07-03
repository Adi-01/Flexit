import axiosInstance from "@/lib/axiosInstance";
import { Product } from "@/types/types";

export const getFilteredProducts = async (
  queryString: string
): Promise<Product[]> => {
  const response = await axiosInstance.get(`/products/filtered/${queryString}`);
  return response.data;
};
