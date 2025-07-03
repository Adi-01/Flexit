import axiosInstance from "@/lib/axiosInstance";
import { Category } from "@/types/interface";

export const fetchCategories = async (): Promise<Category[]> => {
  const res = await axiosInstance.get<Category[]>("products/categories/");
  return res.data;
};
