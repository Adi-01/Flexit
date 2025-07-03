import { ProductCard } from "@/components/cards"; // make sure path is correct
import icons from "@/constants/icons";
import { getFilteredProducts } from "@/lib/api/filteredProducts";
import { Product } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BrandPage() {
  const { brand } = useLocalSearchParams();

  const {
    data: products,
    isLoading,
    error,
  } = useQuery<Product[], Error>({
    queryKey: ["brand-products", brand],
    queryFn: () => getFilteredProducts(`?in_stock=true&brand=${brand}`),
    enabled: !!brand,
  });

  return (
    <SafeAreaView className="flex-1 bg-Fdark">
      {/* 🔙 Header */}
      <View className="flex-row items-center justify-between mb-5 px-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={icons.backArrow} className="size-8" tintColor="#fff" />
        </TouchableOpacity>
        <Text className="text-xl font-rubik-bold text-white text-center flex-1 capitalize">
          {brand} Products
        </Text>
        <View className="w-6 h-6" />
      </View>

      {/* 📦 List */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#fff" className="mt-10" />
      ) : error ? (
        <Text className="text-white text-center mt-10">
          Failed to load products.
        </Text>
      ) : (
        <FlatList
          data={products}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="w-[48%]">
              <ProductCard
                item={item}
                onPress={() => router.push(`/products/${item.id}`)}
              />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
