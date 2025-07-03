import { FeaturedProductCard, ProductCard } from "@/components/cards";
import FilterModal from "@/components/CustomFilters";
import NoResults from "@/components/NoResults";
import SearchBar from "@/components/SearchBar";
import icons from "@/constants/icons";
import { getFilteredProducts } from "@/lib/api/filteredProducts";
import { Product } from "@/types/types";

import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import qs from "qs";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const featuredDummyProduct = [
  {
    $id: "1",
    image: "",
  },
];

export default function HomeScreen() {
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const hasActiveFilters = Object.values(selectedFilters).some(
    (arr) => arr.length > 0
  );
  const activeFilterCount = Object.values(selectedFilters).reduce(
    (total, arr) => total + arr.length,
    0
  );

  const queryString = `?${qs.stringify(
    { ...selectedFilters, in_stock: ["true"] }, // always include in_stock=true
    { arrayFormat: "repeat" }
  )}`;

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery<Product[]>({
    queryKey: ["filtered-products", selectedFilters],
    queryFn: () => getFilteredProducts(queryString),
    staleTime: 1000 * 60 * 10,
  });

  const handleCardPress = (id: number) => {
    router.push({
      pathname: "/products/[id]",
      params: { id: id.toString() },
    });
  };

  return (
    <SafeAreaView className="h-full bg-Fdark">
      <FlatList
        data={products}
        scrollEnabled={!isLoading}
        numColumns={2}
        renderItem={({ item }) => (
          <View className="relative w-[48%]">
            <ProductCard item={item} onPress={() => handleCardPress(item.id)} />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-4 justify-between px-5"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator size="large" className="text-white mt-5" />
          ) : error ? (
            <Text className="text-white text-center mt-5">
              {(error as Error)?.message || "Something went wrong"}
            </Text>
          ) : (
            <NoResults />
          )
        }
        ListHeaderComponent={() => (
          <View className="px-5">
            {/* Header */}
            <View className="flex flex-row items-center justify-between mt-12">
              <View className="flex-1 mr-3">
                <SearchBar
                  readOnly
                  onPressReadOnly={() => router.push("/search")}
                />
              </View>
              <TouchableOpacity
                className="size-[46px] rounded-full bg-Fdark items-center justify-center border border-white"
                onPress={() => router.push("/cart")}
              >
                <Image
                  source={icons.cart}
                  className="size-6"
                  tintColor="#fff"
                />
              </TouchableOpacity>
            </View>

            {/* Featured */}
            <View className="my-5">
              <View className="flex flex-row items-center justify-between mt-2">
                <Text className="text-xl font-rubik-bold text-white">
                  Featured Deals
                </Text>
              </View>
              <FlatList
                data={featuredDummyProduct}
                renderItem={({ item }) => (
                  <FeaturedProductCard
                    item={item}
                    onPress={() => handleCardPress(Number(item.$id))}
                  />
                )}
                keyExtractor={(item) => item.$id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="flex gap-4 mt-5"
              />
            </View>

            {/* Filters */}
            <View className="mt-2">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-xl font-rubik-bold text-white">
                  Our Recommendations
                </Text>
                <TouchableOpacity
                  onPress={() => setFilterVisible(true)}
                  className={`px-4 py-1 rounded-full border ${
                    hasActiveFilters
                      ? "bg-blue-500 border-blue-500"
                      : "border-white"
                  }`}
                >
                  <Text
                    className={`text-[12px] font-rubik-bold ${
                      hasActiveFilters ? "text-white" : "text-white"
                    }`}
                  >
                    {activeFilterCount > 0
                      ? `Filter (${activeFilterCount})`
                      : "Filter"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={(filters) => setSelectedFilters(filters)}
      />
    </SafeAreaView>
  );
}
