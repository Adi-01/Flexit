import { ImageSourcePropType, TextStyle } from "react-native";

export type CartItem = {
  id: number;
  product: number;
  product_title: string;
  color: string;
  color_variant: number;
  size: string;
  size_variant: number;
  quantity: number;
  original_price: number;
  final_price: number;
  thumbnail_url: string;
  brand: string;
  has_discount?: string;
};

export type SizeStock = {
  id: number;
  size: string;
  stock_count: number;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
};

export type Product = {
  id: number;
  title: string;
  slug: string;
  price: string;
  final_price: number;
  thumbnail_url: string;
  discount: string;
  category: string;
  brand: string;
};

export type SettingsItemProps = {
  icon: ImageSourcePropType;
  title: string;
  onPress?: () => void;
  textStyle?: TextStyle;
  showArrow?: boolean;
  tintColor?: string;
};

export type AddressType = {
  id: number;
  user: number;
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  is_default: boolean;
};

export type CartResponse = {
  id: number;
  user: number;
  items: CartItem[];
};

export type AddToCartParams = {
  product: number;
  color_variant: number;
  size_variant: number;
  quantity: number;
  replace?: boolean;
};

export type RemoveFromCartParams = {
  product: number;
  color_variant: number;
  size_variant: number;
};

export type AddToCartControlProps = {
  productId: number;
  colorVariantId: number;
  sizeVariantId: number;
};

export type ProductCardProps = {
  item: Product;
  onPress?: () => void;
};

export type CartActionsProps = {
  product: { id: number; title?: string; brand: string };
  colorId: number | null;
  sizeId: number | null;
  cartItem?: CartItem | null;
};

export interface DetailedProductType {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: string;
  discount: string;
  brand: {
    name: string;
    logo: string;
    slug: string;
  };
  category: string;
  target_audience: string;
  created_at: string;
  final_price: number;
  reviews: {
    id: number;
    user: {
      username: string;
      email: string;
    };
    rating: number;
    comment: string;
    created_at: string;
  }[];
  details: {
    fabric: string;
    composition: string;
    neck_type: string;
    wash_care: string;
    model_reference: string;
    fit_type: string;
    seller: string;
  };
  color_variants: {
    id: number;
    color: string;
    thumbnail_url: string;
    images: {
      image_url: string;
    }[];
    available_sizes: {
      id: number;
      size: string;
      stock_count: number;
    }[];
  }[];
  sizes: string[];
  total_stock: number;
  initial_color: string;
  thumbnail_url: string;
  is_saved: boolean;
}
