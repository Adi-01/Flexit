import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const fetchOrderDetails = async (order_id: string) => {
  const res = await axiosInstance.get(`/orders/${order_id}/`);
  return res.data;
};

const OrderDetails = () => {
  const { order_id } = useLocalSearchParams<{ order_id: string }>();

  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["order-details", order_id],
    queryFn: () => fetchOrderDetails(order_id!),
    enabled: !!order_id,
  });

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-Fdark">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error || !order) {
    return (
      <View className="flex-1 justify-center items-center bg-Fdark px-4">
        <Text className="text-white text-center text-lg">
          Failed to load order details.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-Fdark">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Header */}
        <Text className="text-white text-xl font-rubik-bold mb-2">
          Order #{order.order_id}
        </Text>
        <Text className="text-gray-400 text-sm font-rubik-light mb-4">
          Placed on {format(new Date(order.created_at), "dd MMM yyyy, hh:mm a")}
        </Text>

        {/* Address */}
        <View className="bg-Fdark/80 border border-white/20 p-4 rounded-lg mb-5">
          <Text className="text-white font-rubik text-sm mb-1">
            Delivering to:
          </Text>
          <Text className="text-white text-sm font-rubik-bold">
            {order.address.full_name}
          </Text>
          <Text className="text-white text-sm font-rubik-bold">
            {order.address.address_line}, {order.address.city},{" "}
            {order.address.state} - {order.address.postal_code}
          </Text>
          <Text className="text-white text-sm font-rubik-bold">
            Phone: {order.address.phone}
          </Text>
        </View>

        {/* Order Items */}
        {order.items.map((item: any) => (
          <View
            key={item.id}
            className="flex-row gap-4 mb-4 pb-4 border-b border-white/10"
          >
            <Image
              source={{ uri: item.thumbnail_url }}
              className="w-24 h-28 rounded-lg bg-white"
              resizeMode="cover"
            />
            <View className="flex-1 justify-between">
              <Text className="text-white text-sm font-rubik-bold">
                {item.brand_name}
              </Text>
              <Text
                className="text-gray-300 font-rubik-light text-base"
                numberOfLines={1}
              >
                {item.product_title}
              </Text>

              <View className="flex-row gap-2 mt-2">
                <Text className="text-white text-sm font-rubik">
                  Color: {item.color}
                </Text>
                <Text className="text-white text-sm font-rubik">
                  Size: {item.size}
                </Text>
              </View>

              <Text className="text-white text-sm mt-1 font-rubik">
                Qty: {item.quantity}
              </Text>
            </View>
          </View>
        ))}

        {/* Footer */}
        <View className="mt-6">
          <Text className="text-white text-lg font-rubik-bold">
            Total Paid: ₹{Math.round(order.total_amount)}
          </Text>
        </View>

        {/* Support Link */}
        <TouchableOpacity
          onPress={() => {
            console.log("In progress!!");
          }}
          className="mt-4 py-3 border border-blue-400 rounded-lg"
        >
          <Text className="text-blue-400 text-center font-rubik-semibold">
            Having an issue? Contact Support
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderDetails;
