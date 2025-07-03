import { ProductCard } from "@/components/cards";
import CustomModal from "@/components/customModal";
import icons from "@/constants/icons";
import axiosInstance from "@/lib/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const fetchSavedProducts = async () => {
  const res = await axiosInstance.get("/users/saved-products/");
  return res.data;
};

const Saved = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ["savedProducts"],
    queryFn: fetchSavedProducts,
  });

  const { mutate: deleteSavedProduct } = useMutation({
    mutationFn: async (productId: number) => {
      await axiosInstance.delete(`/users/saved-products/${productId}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedProducts"] });
      setModalVisible(false);
    },
  });

  const handleDeleteRequest = (productId: number) => {
    setSelectedProductId(productId);
    setModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (selectedProductId !== null) {
      deleteSavedProduct(selectedProductId);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-Fdark">
        <Text className="text-white">Loading saved products...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center bg-Fdark px-6">
        <Text className="text-red-500 font-bold text-lg text-center">
          Failed to load saved products.
        </Text>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-Fdark px-6">
        <Text className="text-white text-lg font-rubik-semibold text-center">
          You have no saved products.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-Fdark px-4">
      <View className="flex-row items-center justify-between mb-5">
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={icons.backArrow}
            className="size-8 ml-[-20px]"
            resizeMode="contain"
            tintColor={"#fff"}
          />
        </TouchableOpacity>

        <Text className="text-xl font-rubik-bold text-white text-center flex-1 ml-[20px]">
          Saved Products
        </Text>

        <View className="w-6 h-6" />
      </View>

      <FlatList
        data={data}
        key={"grid-2-columns"}
        numColumns={2}
        keyExtractor={(item) => item.product.id.toString()}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 12,
        }}
        renderItem={({ item }) => (
          <View className="relative w-[48%]">
            {/* 🗑️ Delete Button */}
            <TouchableOpacity
              className="absolute top-6 right-2 z-10 bg-red-600 p-1 rounded-full"
              onPress={() => handleDeleteRequest(item.product.id)}
            >
              <Image
                source={icons.delete}
                className="size-4"
                resizeMode="contain"
                tintColor="#fff"
              />
            </TouchableOpacity>

            <ProductCard
              item={{
                ...item.product,
                brand: item.product.brand?.name || "Unknown",
              }}
              onPress={() =>
                router.push({
                  pathname: "/products/[id]",
                  params: { id: item.product.id.toString() },
                })
              }
            />
          </View>
        )}
      />

      {/* 🧾 Confirmation Modal */}
      <CustomModal
        visible={modalVisible}
        title="Remove Product?"
        message="Are you sure you want to remove this item from saved products?"
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmDelete}
        showCancel
        confirmText="Remove"
        cancelText="Cancel"
      />
    </SafeAreaView>
  );
};

export default Saved;
