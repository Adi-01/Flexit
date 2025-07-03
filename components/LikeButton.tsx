import axiosInstance from "@/lib/axiosInstance";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";

type LikeButtonProps = {
  productId: number;
  initialIsSaved: boolean;
};

const LikeButton = ({ productId, initialIsSaved }: LikeButtonProps) => {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsSaved(initialIsSaved);
  }, [initialIsSaved]);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (isSaved) {
        await axiosInstance.delete(`/users/saved-products/${productId}/`);
        setIsSaved(false);
      } else {
        await axiosInstance.post(`/users/saved-products/${productId}/`);
        setIsSaved(true);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedProducts"] });
    },
  });

  return (
    <TouchableOpacity
      onPress={() => mutate()}
      className="absolute top-14 right-5 bg-black rounded-full z-10"
      disabled={isPending}
    >
      <View className="bg-white/30 rounded-full size-10 items-center justify-center">
        {isPending ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Ionicons
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={21}
            color="#FFFFFF"
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default LikeButton;
