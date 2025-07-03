import { useMemo } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

type SizeStock = { size: string; stock_count: number };

type ImageObject = {
  image_url: string;
};

export type Variant = {
  color: string;
  images: ImageObject[];
  available_sizes: SizeStock[];
};

type Props = {
  sizes: string[];
  colorVariants: Variant[];
  activeColor: string | null;
  onColorChange: (color: string) => void;
  selectedSize: string | null;
  onSizeChange: (size: string | null) => void;
};

export default function ProductVariants({
  sizes,
  colorVariants,
  activeColor,
  onColorChange,
  selectedSize,
  onSizeChange,
}: Props) {
  const availableSizes = useMemo(() => {
    if (!activeColor) return [];
    return (
      colorVariants.find((cv) => cv.color === activeColor)?.available_sizes ||
      []
    );
  }, [activeColor, colorVariants]);

  const availableColors = useMemo(() => {
    if (!selectedSize) return colorVariants.map((cv) => cv.color);
    return colorVariants
      .filter((cv) => cv.available_sizes.some((s) => s.size === selectedSize))
      .map((cv) => cv.color);
  }, [selectedSize, colorVariants]);

  return (
    <View className="space-y-7 mt-7">
      {/* Available Colors with Image */}
      <View className="bg-light/20 rounded-lg p-4">
        <Text className="text-white font-rubik-bold text-[15px] mb-3">
          Available Colors
        </Text>
        {activeColor && (
          <Text className="text-white font-rubik-light text-[13px] mb-3">
            Color: {activeColor}
          </Text>
        )}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10 }}
        >
          {colorVariants
            .slice()
            .reverse()
            .map((variant, index) => {
              const isAvailable = availableColors.includes(variant.color);
              const isSelected = activeColor === variant.color;

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    if (!isAvailable) return;
                    onColorChange(variant.color);
                    onSizeChange(null);
                  }}
                  style={{
                    opacity: isAvailable ? 1 : 0.3,
                    width: 60,
                    height: 100,
                  }}
                >
                  <View
                    className="border-2 border-white overflow-hidden rounded-lg items-center justify-center"
                    style={{
                      width: 60,
                      height: 100,
                      padding: isSelected ? 0.5 : 0,
                      paddingHorizontal: isSelected ? 1 : 0,
                    }}
                  >
                    <Image
                      source={{ uri: variant.images?.[0]?.image_url }}
                      resizeMode="cover"
                      style={{
                        width: !isSelected ? "100%" : "95%",
                        height: !isSelected ? "100%" : "95%",
                      }}
                      className={isSelected ? "rounded-md" : ""}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
        </ScrollView>
      </View>

      {/* Available Sizes */}
      <View className="bg-light/20 rounded-lg p-4 mt-7">
        <Text className="text-white font-rubik-bold text-[15px] mb-3">
          Available Sizes
        </Text>
        {!activeColor && (
          <Text className="mb-4 text-white font-rubik-light">
            Select a color to view the available size(s)
          </Text>
        )}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10 }}
        >
          {sizes.map((size, index) => {
            const isAvailable = availableSizes.some((s) => s.size === size);
            const isSelected = selectedSize === size;

            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  if (!isAvailable) return;
                  onSizeChange(isSelected ? null : size);
                }}
                className={`size-14 rounded-xl justify-center items-center bg-white/10 ${
                  isSelected ? "border-white" : "border-white/50"
                }`}
                style={{
                  opacity: isAvailable ? 1 : 0.4,
                  borderWidth: 2,
                  borderStyle: isAvailable ? "solid" : "dashed",
                }}
              >
                <Text className="text-white font-rubik-bold text-sm px-3">
                  {size}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}
