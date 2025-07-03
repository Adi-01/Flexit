import { addToCart, fetchCart } from "@/lib/api/cart";
import { AddToCartControlProps, CartItem, CartResponse } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Text, TouchableOpacity } from "react-native";

export default function AddToCartControlsForProductDetailsPage({
  productId,
  colorVariantId,
  sizeVariantId,
}: AddToCartControlProps) {
  const queryClient = useQueryClient();
  const [justAddedKey, setJustAddedKey] = useState<string | null>(null);

  const { data: cart, isLoading: cartLoading } = useQuery<CartResponse>({
    queryKey: ["cart"],
    queryFn: fetchCart,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const currentKey = `${productId}-${colorVariantId}-${sizeVariantId}`;

  const existingItem = useMemo<CartItem | undefined>(() => {
    return cart?.items.find(
      (item) =>
        item.product === productId &&
        item.color_variant === colorVariantId &&
        item.size_variant === sizeVariantId
    );
  }, [cart?.items, productId, colorVariantId, sizeVariantId]);

  // Reset justAdded when variant changes
  useEffect(() => {
    setJustAddedKey(null);
  }, [productId, colorVariantId, sizeVariantId]);

  const { mutate: updateCart, isPending } = useMutation({
    mutationFn: addToCart,
    onSuccess: async () => {
      setJustAddedKey(currentKey);
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const handleAddToCart = () => {
    updateCart({
      product: productId,
      color_variant: colorVariantId,
      size_variant: sizeVariantId,
      quantity: 1,
    });
  };

  const isVariantSelected = !!colorVariantId && !!sizeVariantId;

  if (!isVariantSelected) {
    return (
      <TouchableOpacity
        disabled
        className="flex-1 bg-gray-500 py-3 rounded-full opacity-50"
      >
        <Text className="text-white text-center font-semibold">
          Select Variant
        </Text>
      </TouchableOpacity>
    );
  }

  if (cartLoading) {
    return (
      <TouchableOpacity
        disabled
        className="flex-1 bg-gray-500 py-3 rounded-full opacity-50"
      >
        <Text className="text-white text-center font-semibold">Loading...</Text>
      </TouchableOpacity>
    );
  }

  const isAdded = existingItem != null || justAddedKey === currentKey;

  return isAdded ? (
    <TouchableOpacity
      className="flex-1 bg-green-500 py-3 rounded-full opacity-80"
      onPress={() => {
        router.push("/cart");
      }}
    >
      <Text className="text-white text-center font-rubik-semibold">
        Go to cart
      </Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      onPress={handleAddToCart}
      disabled={isPending}
      className="flex-1 bg-accent py-3 rounded-full"
    >
      <Text className="text-white text-center font-rubik-semibold">
        {isPending ? "Adding..." : "Add to Cart"}
      </Text>
    </TouchableOpacity>
  );
}
