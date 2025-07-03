import icons from "@/constants/icons";
import images from "@/constants/images";
import { ProductCardProps } from "@/types/types";

import React from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";

interface FeaturedProduct {
  $id: string;
  image: string;
}

interface FeaturedProductProps {
  item: FeaturedProduct;
  onPress?: () => void;
}
const screenWidth = Dimensions.get("window").width;
const cardWidth = screenWidth * 0.9; // ~80% of screen width

export const formatPriceWithCommas = (amount: number): string => {
  return amount.toLocaleString("en-IN");
};

export const FeaturedProductCard = ({
  item,
  onPress,
}: FeaturedProductProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex flex-col items-start h-60 relative"
      style={{
        width: cardWidth,
      }}
    >
      <Image source={images.featured} className="size-full rounded-2xl" />
    </TouchableOpacity>
  );
};

export const ProductCard = ({ item, onPress }: ProductCardProps) => {
  const { thumbnail_url, title, final_price, price, brand, discount } = item;
  const hasDiscount = Number(discount) > 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="mt-3 rounded-lg relative p-1"
    >
      <View className="relative">
        <Image
          source={{ uri: thumbnail_url }}
          className="w-full h-60 rounded-lg"
        />

        <Image
          source={images.cardGradient}
          className="size-full rounded-lg absolute bottom-0"
        />

        {/* 🔖 Discount Badge - Top Left */}
        {hasDiscount && (
          <View className="absolute top-2 left-2 bg-discount px-2 py-1 rounded-full flex-row items-center z-50">
            <Text className="text-sm font-rubik-semibold text-white">
              -{Number(discount)}% OFF
            </Text>
          </View>
        )}

        {/* ⭐ Rating - Bottom Right */}
        <View className="flex flex-row items-center absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded-full z-50">
          <Image source={icons.star} className="size-3.5" />
          <Text className="text-xs font-rubik-bold text-primary-300 ml-1">
            4.4
          </Text>
        </View>
      </View>

      <View className="mt-1 flex flex-col items-start">
        <Text className="text-base text-white font-rubik-semibold">
          {brand}
        </Text>
        <Text
          className="text-sm font-rubik-light text-white mt-[-2px]"
          numberOfLines={1}
        >
          {title}
        </Text>

        {/* 💰 Final & Actual Price on Same Line */}
        <View className="flex flex-row items-center space-x-2">
          {hasDiscount && (
            <Text className="text-sm text-white/60 line-through mr-0.5">
              ₹{formatPriceWithCommas(Number(price))}
            </Text>
          )}

          <Text className="text-sm font-rubik-semibold text-white">
            ₹{formatPriceWithCommas(Math.round(final_price))}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
