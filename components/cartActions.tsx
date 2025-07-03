import { addToCart, removeFromCart } from "@/lib/api/cart";
import { CartActionsProps } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Text, TouchableOpacity, View } from "react-native";

export default function CartActions({
  product,
  colorId,
  sizeId,
  cartItem,
}: CartActionsProps) {
  const queryClient = useQueryClient();

  const { mutate: updateCart, isPending: isUpdating } = useMutation({
    mutationFn: addToCart,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const { mutate: removeCartItem, isPending: isRemoving } = useMutation({
    mutationFn: removeFromCart,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const handleUpdate = (change: number) => {
    const currentQty = cartItem?.quantity ?? 0;
    const newQty = currentQty + change;

    if (newQty < 1) {
      removeCartItem({
        product: product.id,
        color_variant: colorId!,
        size_variant: sizeId!,
      });
      return;
    }

    updateCart({
      product: product.id,
      color_variant: colorId!,
      size_variant: sizeId!,
      quantity: newQty,
      replace: true,
    });
  };

  const quantity = cartItem?.quantity ?? 0;
  const isDisabled = isUpdating || isRemoving;

  return (
    <>
      {quantity > 0 && (
        <View className="flex-row items-center border border-white rounded-full overflow-hidden self-start w-[85px]">
          <TouchableOpacity
            onPress={() => handleUpdate(-1)}
            disabled={isDisabled}
            className={`size-[22px] items-center justify-center border-r ${
              isDisabled ? " border-gray-200" : " border-white"
            }`}
          >
            <Text className="text-white text-base font-semibold">−</Text>
          </TouchableOpacity>

          <View className="w-[38px] h-6 items-center justify-center">
            <Text className="text-white text-base font-rubik-medium">
              {quantity}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => handleUpdate(1)}
            disabled={isDisabled}
            className={`size-[22px] items-center justify-center border-l ${
              isDisabled ? "border-gray-200" : "border-white"
            }`}
          >
            <Text className="text-white text-base font-semibold">+</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}
