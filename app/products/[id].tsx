import AddToCartControlsForProductDetailsPage from "@/components/AddToCartControls";
import { formatPriceWithCommas } from "@/components/cards";
import ImageGallery from "@/components/ImageGallery";
import LikeButton from "@/components/LikeButton";
import ProductVariants, { Variant } from "@/components/ProductVariants";
import icons from "@/constants/icons";
import axiosInstance from "@/lib/axiosInstance";
import { DetailedProductType, SizeStock } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const fetchProduct = async (id: string): Promise<DetailedProductType> => {
  const res = await axiosInstance.get<DetailedProductType>(`products/${id}/`);
  return res.data;
};

const ProductDetail = () => {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const scrollY = useRef(new Animated.Value(0)).current;
  const [showDetails, setShowDetails] = useState(false);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery<DetailedProductType>({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (!activeColor && product?.initial_color) {
      setActiveColor(product.initial_color);
    }
  }, [product, activeColor]);

  const selectedColorVariant = useMemo(() => {
    return (
      product?.color_variants?.find((v: Variant) => v.color === activeColor) ??
      null
    );
  }, [product, activeColor]);

  const selectedColorVariantId = selectedColorVariant?.id ?? null;

  const selectedSizeId = useMemo(() => {
    if (!selectedColorVariant || !selectedSize) return null;
    return (
      selectedColorVariant.available_sizes.find(
        (s: SizeStock) => s.size === selectedSize
      )?.id ?? null
    );
  }, [selectedColorVariant, selectedSize]);

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const sizeOrder = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"];

  const sortedSizes = [...(product?.sizes || [])].sort(
    (a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b)
  );

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-6">
        <Text className="text-red-500 font-bold text-lg text-center">
          Failed to load product.
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 px-4 py-2 bg-black rounded-full"
        >
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-Fdark">
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 160 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {activeColor && (
          <Animated.View style={{ opacity: imageOpacity }}>
            <ImageGallery
              images={
                product?.color_variants?.find(
                  (v: Variant) => v.color === activeColor
                )?.images || []
              }
            />
          </Animated.View>
        )}

        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-14 bg-black rounded-full left-5 z-10"
        >
          <View className="bg-white/30 rounded-full size-10 items-center justify-center">
            <Image
              source={icons.backArrow}
              className="size-6"
              tintColor="#fff"
            />
          </View>
        </TouchableOpacity>

        <LikeButton
          productId={product?.id ?? 0}
          initialIsSaved={product?.is_saved ?? false}
        />

        <View className="bg-Fdark rounded-t-lg px-5 pt-5">
          {/* Title + Price */}
          <View className="bg-light/20 rounded-lg p-3">
            <Text className="text-lg text-white mb-2 font-rubik-semibold">
              {product?.title}
            </Text>
            <View className="flex-col items-start gap-1">
              <View className="flex-row items-center gap-3">
                <Text className="text-xl text-green-400 font-semibold">
                  -{Number(product?.discount)}% off
                </Text>
                <Text className="text-xl text-white font-bold">
                  ₹{formatPriceWithCommas(product?.final_price)}
                </Text>
              </View>
              <Text className="text-sm text-white/60 font-rubik line-through">
                M.R.P : ₹{formatPriceWithCommas(Number(product?.price))}
              </Text>
            </View>
          </View>

          {/* Brand */}
          <TouchableOpacity
            className="bg-light/20 rounded-lg p-3 mt-7 flex-row items-center justify-between"
            onPress={() =>
              router.push({
                pathname: "/brand/[brand]",
                params: { brand: product.brand.slug },
              })
            }
          >
            <View className="flex-row items-center gap-3.5">
              <Image
                source={{ uri: product.brand.logo }}
                className="size-12 rounded-lg"
                resizeMode="cover"
              />
              <View>
                <Text className="text-white font-rubik-bold">
                  {product.brand.name}
                </Text>
                <Text className="text-gray-300 font-rubik-light">
                  Explore all products
                </Text>
              </View>
            </View>
            <Image
              source={icons.rightArrow}
              tintColor={"#fff"}
              className="size-6"
            />
          </TouchableOpacity>

          <ProductVariants
            colorVariants={product.color_variants ?? []}
            sizes={sortedSizes}
            activeColor={activeColor}
            onColorChange={(color) => {
              setActiveColor(color);
              setSelectedSize(null);
            }}
            selectedSize={selectedSize}
            onSizeChange={setSelectedSize}
          />

          {/* Details Dropdown */}
          <View className="mt-7 bg-light/20 rounded-lg overflow-hidden px-3">
            <TouchableOpacity
              onPress={() => setShowDetails(!showDetails)}
              className="flex-row justify-between items-center py-3"
            >
              <Text className="text-white font-rubik-bold text-[15px]">
                Product details
              </Text>
              <Image
                source={showDetails ? icons.up : icons.down}
                tintColor={"#fff"}
                className="size-6"
              />
            </TouchableOpacity>
            <View className={!showDetails ? "" : "border-b border-white"} />

            {showDetails && (
              <View className="py-3 space-y-3">
                {[
                  ["Fabric", product.details?.fabric],
                  ["Fabric Composition", product.details?.composition],
                  ["Neck Type", product.details?.neck_type],
                  ["Wash Care", product.details?.wash_care],
                  ["Model Reference", product.details?.model_reference],
                  ["Size", product.sizes],
                  ["Fit Type", product.details?.fit_type],
                  ["Gender", product.target_audience],
                  ["Seller", product.details?.seller],
                ].map(([label, value], index) =>
                  (Array.isArray(value) ? value.length > 0 : !!value) ? (
                    <View
                      key={`${label}-${index}`}
                      className="flex-row py-2 gap-5"
                    >
                      <Text className="text-white font-rubik-semibold w-[140px]">
                        {label}
                      </Text>
                      <Text className="text-gray-300 flex-1 text-left font-rubik-light">
                        {Array.isArray(value) ? value.join(", ") : value}
                      </Text>
                    </View>
                  ) : null
                )}
              </View>
            )}
          </View>

          {/* Reviews */}
          <View className="mt-7 bg-light/20 rounded-lg p-3">
            <Text className="text-xl font-bold text-white mb-3">
              Customer Reviews
            </Text>
            {product.reviews && product.reviews.length > 0 ? (
              <View className="space-y-4">
                {product.reviews.map((review) => (
                  <View
                    key={review.id}
                    className="bg-[#1f1f1f] p-4 rounded-lg border border-gray-800"
                  >
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="text-white font-semibold">
                        {review.user?.username || "Anonymous"}
                      </Text>
                      <Text className="text-yellow-400 font-bold text-sm">
                        ★ {review.rating}
                      </Text>
                    </View>
                    <Text className="text-gray-300">{review.comment}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-gray-400 italic">
                No customer reviews yet.
              </Text>
            )}
          </View>
        </View>
      </Animated.ScrollView>

      {/* Bottom Buttons */}
      <View className="absolute bottom-0 w-full px-5 py-4 bg-Fdark border-t border-gray-800 flex-row gap-4 z-10">
        <TouchableOpacity
          className="flex-1 bg-gray-700 py-3 rounded-full"
          onPress={() => console.log("Buy Now")}
        >
          <Text className="text-white text-center text-base font-semibold">
            Buy Now
          </Text>
        </TouchableOpacity>

        {selectedColorVariantId && selectedSizeId ? (
          <AddToCartControlsForProductDetailsPage
            productId={product.id}
            colorVariantId={selectedColorVariantId}
            sizeVariantId={selectedSizeId}
          />
        ) : (
          <TouchableOpacity
            disabled
            className="flex-1 bg-gray-500 py-3 rounded-full opacity-50"
          >
            <Text className="text-white text-center font-semibold">
              Select Variant
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ProductDetail;
