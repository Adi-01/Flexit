// app/search-results.tsx
import { ProductCard } from "@/components/cards";
import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const fetchSearchResults = async (query: string) => {
  const res = await axiosInstance.get(`/products/search/?q=${query}`);
  return res.data;
};

const SearchResults = () => {
  const { q } = useLocalSearchParams();
  const query = typeof q === "string" ? q : "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["searchResults", query],
    queryFn: () => fetchSearchResults(query),
    enabled: !!query,
  });

  return (
    <SafeAreaView className="flex-1 bg-Fdark px-4">
      <Text className="text-white font-rubik text-base mt-2 mb-4">
        Showing results for{" "}
        <Text className="font-rubik-bold"> &quot;{query}&quot;</Text>
      </Text>

      {isLoading && (
        <View className="flex-1 justify-center items-center">
          <Text className="text-white">Searching...</Text>
        </View>
      )}

      {isError && (
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500">Failed to fetch results.</Text>
        </View>
      )}

      {!isLoading && data?.length === 0 && (
        <View className="flex-1 justify-center items-center">
          <Text className="text-white">No products found.</Text>
        </View>
      )}

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 12,
        }}
        renderItem={({ item }) => (
          <View className="relative w-[48%]">
            <ProductCard
              item={item}
              onPress={() =>
                router.push({
                  pathname: "/products/[id]",
                  params: { id: item.id.toString() },
                })
              }
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default SearchResults;
