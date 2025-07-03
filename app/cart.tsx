import { formatPriceWithCommas } from "@/components/cards";
import CartActions from "@/components/cartActions";
import icons from "@/constants/icons";
import { fetchCart } from "@/lib/api/cart";
import { useAuth } from "@/lib/auth/AuthContext";
import { CartResponse } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "expo-checkbox";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CartScreen() {
  const {
    data: cart,
    isLoading,
    error,
  } = useQuery<CartResponse, Error>({
    queryKey: ["cart"],
    queryFn: fetchCart,
  });

  const { user } = useAuth();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const toggleSelect = (itemId: number) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const itemsCount = cart?.items?.length || 0;
  const hasCartItems =
    !!cart && Array.isArray(cart.items) && cart.items.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-Fdark">
      {/* Header always shown */}
      <View className="flex-row items-center justify-between px-4 pt-4 mb-5">
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={icons.backArrow}
            className="size-8"
            resizeMode="contain"
            tintColor={"#fff"}
          />
        </TouchableOpacity>

        <Text className="text-xl font-rubik-bold text-white text-center flex-1">
          {user?.username}&apos;s Cart ({itemsCount})
        </Text>

        <View className="w-6 h-6" />
      </View>

      {/* Loading */}
      {isLoading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {/* Error or Empty */}
      {!isLoading && (error || !cart?.items?.length) && (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-white text-lg text-center">
            Your cart is empty.
          </Text>
        </View>
      )}

      {/* Cart List */}
      {hasCartItems && (
        <FlatList
          data={cart.items}
          contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16 }}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="flex-row gap-4 py-4 border-t border-gray-300">
              {/* Left: Image + Checkbox */}
              <View className="w-32 relative">
                <Image
                  source={{ uri: item.thumbnail_url }}
                  className="w-full h-40 rounded-lg bg-white"
                  resizeMode="cover"
                />
                <View className="absolute top-2 left-2">
                  <Checkbox
                    value={selectedItems.includes(item.id)}
                    onValueChange={() => toggleSelect(item.id)}
                    color={
                      selectedItems.includes(item.id) ? "#4DA8DA" : undefined
                    }
                    style={{
                      borderColor: selectedItems.includes(item.id)
                        ? "#4DA8DA"
                        : "#aaa",
                    }}
                  />
                </View>
              </View>

              {/* Right: Info + CartActions */}
              <View className="flex-1 justify-center flex-col">
                <View className="gap-1">
                  <Text className="text-white font-rubik-semibold text-base">
                    {item.brand}
                  </Text>
                  <Text
                    className="text-gray-300 font-rubik-light text-sm"
                    numberOfLines={1}
                  >
                    {item.product_title}
                  </Text>

                  <View className="flex-row gap-3 my-1">
                    <View className="border border-white px-3 py-1 rounded-full self-start">
                      <Text className="text-white text-sm font-rubik">
                        Color: {item.color}
                      </Text>
                    </View>
                    <View className="border border-white px-3 py-1 rounded-full self-start">
                      <Text className="text-white text-sm font-rubik">
                        Size: {item.size}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center gap-2 justify-start">
                    <Text className="text-sm text-white/60 font-rubik line-through">
                      M.R.P : ₹
                      {formatPriceWithCommas(Number(item.original_price))}
                    </Text>
                    <Text className="text-sm text-white font-bold">
                      ₹
                      {formatPriceWithCommas(
                        Math.round(Number(item.final_price))
                      )}
                    </Text>
                    <Text className="text-sm text-green-400 font-semibold">
                      -{Number(item.has_discount)}% off
                    </Text>
                  </View>
                </View>

                <View className="mt-3">
                  <CartActions
                    product={{
                      id: item.product,
                      title: item.product_title,
                      brand: item.brand,
                    }}
                    colorId={item.color_variant}
                    sizeId={item.size_variant}
                    cartItem={item}
                  />
                </View>
              </View>
            </View>
          )}
        />
      )}

      {/* Checkout Button */}
      {selectedItems.length > 0 && (
        <View className="absolute bottom-4 left-4 right-4">
          <TouchableOpacity className="bg-green-600 p-4 rounded-full">
            <Text className="text-white text-center text-base font-rubik-bold">
              Proceed to Checkout {selectedItems.length} item
              {selectedItems.length > 1 ? "s" : ""}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
