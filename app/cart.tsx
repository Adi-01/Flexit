import { formatPriceWithCommas } from "@/components/cards";
import CartActions from "@/components/cartActions";
import SlideToCheckout from "@/components/swipeToCheckOut";
import icons from "@/constants/icons";
import { fetchCart } from "@/lib/api/cart";
import { useAuth } from "@/lib/auth/AuthContext";
import axiosInstance from "@/lib/axiosInstance";
import { AddressType, CartResponse } from "@/types/types";
import { useStripe } from "@stripe/stripe-react-native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "expo-checkbox";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const fetchAddresses = async (): Promise<AddressType[]> => {
  const res = await axiosInstance.get("users/addresses/");
  return res.data;
};

export default function CartScreen() {
  const {
    data: cart,
    isLoading,
    error,
  } = useQuery<CartResponse, Error>({
    queryKey: ["cart"],
    queryFn: fetchCart,
  });

  const { data: addresses, isLoading: isAddressLoading } = useQuery<
    AddressType[]
  >({
    queryKey: ["addresses"],
    queryFn: fetchAddresses,
  });

  const queryClient = useQueryClient();
  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    }, [queryClient])
  );

  const { user } = useAuth();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressType | null>(
    null
  );
  const [showAddressModal, setShowAddressModal] = useState(false);

  const toggleSelect = (itemId: number) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const defaultAddr = addresses.find((a) => a.is_default) || addresses[0];
      setSelectedAddress(defaultAddr);
    } else {
      // 🧹 Clear stale address if all are deleted
      setSelectedAddress(null);
    }
  }, [addresses]);

  const itemsCount = cart?.items?.length || 0;
  const hasCartItems =
    !!cart && Array.isArray(cart.items) && cart.items.length > 0;

  // 🧮 Total Price of selected items
  const total = useMemo(() => {
    return (
      cart?.items
        ?.filter((item) => selectedItems.includes(item.id))
        .reduce(
          (sum, item) => sum + Number(item.final_price) * item.quantity,
          0
        ) || 0
    );
  }, [cart, selectedItems]);

  const handleCheckout = async () => {
    if (!addresses || addresses.length === 0) {
      Alert.alert(
        "No Address Found",
        "Please add a delivery address before proceeding to checkout.",
        [
          {
            text: "Add Address",
            onPress: () => router.push("/profile/saved-address"),
          },
          { text: "Cancel", style: "cancel" },
        ]
      );
      setSelectedItems([]);
      return;
    }

    try {
      setLoadingPayment(true);

      const { data } = await axiosInstance.post(
        "payment/create-sheet-intent/",
        {
          amount: Math.round(total),
          selected_item_ids: selectedItems,
          address_id: selectedAddress?.id,
        }
      );

      const clientSecret = data.clientSecret;

      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "Flexit",
        allowsDelayedPaymentMethods: false,
      });

      if (initError) {
        setLoadingPayment(false); // also hide if init fails
        Alert.alert("Init Error", initError.message);
        return;
      }

      setLoadingPayment(false); // ✅ Hide before showing sheet

      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        Alert.alert("Payment failed", paymentError.message);
        setSelectedItems([]);
      } else {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        router.push("/order_successful");
        setSelectedItems([]);
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Something went wrong during payment.");
      setLoadingPayment(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-Fdark">
      {/* Header */}
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

      {/* Empty */}
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

      {/* Total + Checkout Button */}
      {selectedItems.length > 0 && (
        <View className="px-6 py-3 bg-Fdark border-t border-white/20">
          {/* Total */}
          <View className="flex-row items-center justify-between mb-2 bg-light/70 p-3 rounded-lg mt-2">
            <Text className="text-white text-xl font-rubik-semibold">
              Total:
            </Text>
            <Text className="text-white text-xl font-rubik-bold">
              ₹{formatPriceWithCommas(Math.round(total))}
            </Text>
          </View>

          {/* Delivering to */}
          {!isAddressLoading && selectedAddress && (
            <View className="mt-3 flex-row justify-between items-center mb-2 bg-light/70 p-3 rounded-lg">
              <View className="flex-col items-start justify-between">
                <Text className="text-white text-sm font-rubik-light">
                  Delivering to:{" "}
                </Text>
                <Text className="font-rubik-semibold text-white text-sm">
                  {selectedAddress.full_name}
                </Text>
                <Text
                  className="font-rubik-semibold text-white text-sm"
                  numberOfLines={1}
                >
                  {selectedAddress.address_line}, {selectedAddress.city},{" "}
                  {selectedAddress.state}
                </Text>
              </View>
              {addresses && addresses.length > 1 && (
                <TouchableOpacity onPress={() => setShowAddressModal(true)}>
                  <Text className="text-blue-400 font-rubik-semibold text-sm ml-2">
                    Change
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Add Address CTA if none */}
          {!isAddressLoading && (!addresses || addresses.length === 0) && (
            <View className="mt-2">
              <Text className="text-yellow-400 text-sm">
                No address found. Please add one to proceed.
              </Text>
              <TouchableOpacity
                className="border border-yellow-400 px-4 py-2 rounded-md mt-2"
                onPress={() => router.push("/profile/saved-address")}
              >
                <Text className="text-yellow-400 text-center font-semibold">
                  Add Address
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Swipe to Checkout Button */}
          <View className="mt-4 items-center justify-center">
            <SlideToCheckout
              onSuccess={handleCheckout}
              disabled={loadingPayment}
            />
          </View>
        </View>
      )}
      {showAddressModal && addresses && (
        <View className="absolute bottom-0 left-0 right-0 bg-Fdark border-t border-white/20 p-4 max-h-[50%] rounded-t-2xl">
          <Text className="text-white text-lg font-semibold mb-3">
            Select Address
          </Text>

          {addresses.map((addr) => (
            <TouchableOpacity
              key={addr.id}
              onPress={() => {
                setSelectedAddress(addr);
                setShowAddressModal(false);
              }}
              className="mb-3 p-3 rounded-lg border border-white/20 bg-Fdark/90"
            >
              <Text className="text-white font-semibold">{addr.full_name}</Text>
              <Text className="text-white text-sm">{addr.address_line}</Text>
              <Text className="text-white text-sm">
                {addr.city}, {addr.state}, {addr.postal_code}
              </Text>
              <Text className="text-white text-sm">Phone: {addr.phone}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={() => setShowAddressModal(false)}
            className="mt-2 py-2"
          >
            <Text className="text-red-400 text-center font-semibold">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {loadingPayment && (
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/40 z-50 justify-center items-center">
          <ActivityIndicator size="large" color="#fff" />
          <Text className="text-white mt-3 font-semibold">
            Opening Payment...
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
