import icons from "@/constants/icons";
import { useAuth } from "@/lib/auth/AuthContext";
import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { router } from "expo-router";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ListOrderItem = {
  id: number;
  product_title: string;
  brand_name: string;
  thumbnail_url: string;
  created_at: string;
  brand_slug: string;
  order_id: string;
};

export default function MyOrdersScreen() {
  const { user } = useAuth();

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery<ListOrderItem[]>({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const res = await axiosInstance.get("/orders/my-orders/");
      const flatItems: ListOrderItem[] = res.data.flatMap((order: any) =>
        order.items.map((item: any) => ({
          ...item,
          created_at: order.created_at,
          order_id: order.order_id,
        }))
      );
      // console.log("📦 Flattened Order Items:", flatItems);
      return flatItems;
    },
  });

  const handleOrderDetail = (order_id: string) => {
    router.push({
      pathname: "/profile/my-orders/[order_id]",
      params: { order_id: order_id },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-Fdark px-4">
      {/* Header */}
      <View className="flex-row items-center justify-between pt-4 mb-2">
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={icons.backArrow}
            className="size-8"
            resizeMode="contain"
            tintColor={"#fff"}
          />
        </TouchableOpacity>

        <Text className="text-xl font-rubik-bold text-white text-center flex-1">
          {user?.username}&apos;s Orders
        </Text>

        <View className="w-6 h-6" />
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-white">Loading Orders...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-white font-rubik-medium">
            Something went wrong.
          </Text>
        </View>
      ) : orders?.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-white font-rubik-medium">No orders found.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View className="flex-row gap-3 py-4 border-t border-white/10">
              {/* Left: Image */}
              <View className="rounded-lg bg-white overflow-hidden">
                <Image
                  source={{ uri: item.thumbnail_url }}
                  className="size-16"
                  resizeMode="cover"
                />
              </View>

              {/* Right: Details */}
              <TouchableOpacity
                className="flex-row justify-between items-center gap-4 flex-1"
                onPress={() => {
                  handleOrderDetail(item.order_id);
                }}
              >
                {/* Left: Details */}
                <View className="flex-1 justify-between">
                  <TouchableOpacity
                    onPress={() => {
                      router.push(`/brand/${item.brand_slug}`);
                    }}
                  >
                    <Text
                      className="text-white font-rubik-semibold text-sm"
                      numberOfLines={1}
                    >
                      {item.brand_name}
                    </Text>
                  </TouchableOpacity>
                  <Text
                    className="text-gray-300 text-sm font-rubik-light"
                    numberOfLines={1}
                  >
                    {item.product_title}
                  </Text>

                  <Text className="text-gray-400 text-xs mt-1 font-rubik">
                    Purchased on:{" "}
                    {format(new Date(item.created_at), "dd MMM yyyy, hh:mm a")}
                  </Text>
                </View>

                {/* Right: Arrow */}
                <View className="items-center justify-center">
                  <Image
                    source={icons.rightArrow}
                    className="w-5 h-5"
                    resizeMode="contain"
                    tintColor="#fff"
                  />
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
