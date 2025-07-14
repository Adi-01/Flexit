import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";

type FilterCategory =
  | "categories"
  | "brands"
  | "colors"
  | "sizes"
  | "target_audience";

type Brand = {
  name: string;
  slug: string;
};

type FilterData = {
  categories: string[];
  brands: Brand[];
  colors: string[];
  sizes: string[];
  target_audience: string[];
};

type SelectedFilters = {
  [K in FilterCategory]?: string[]; // we will store slugs here
};

type FilterModalProps = {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: SelectedFilters) => void;
};

const FILTER_CATEGORIES: FilterCategory[] = [
  "categories",
  "brands",
  "colors",
  "sizes",
  "target_audience",
];

const fetchFilters = async (): Promise<FilterData> => {
  const res = await axiosInstance.get<FilterData>("/products/filters/");
  return res.data;
};

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
}) => {
  const [selectedCategory, setSelectedCategory] =
    useState<FilterCategory>("categories");
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});

  const { data: filterData, isLoading } = useQuery({
    queryKey: ["filters"],
    queryFn: fetchFilters,
    enabled: visible,
  });

  const getValuesForCategory = (key: FilterCategory): (string | Brand)[] => {
    return filterData?.[key] || [];
  };

  const toggleSelection = (category: FilterCategory, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[category] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const sortSizes = (sizes: (string | Brand)[]): (string | Brand)[] => {
    const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL"];

    return [...sizes].sort((a, b) => {
      const valA = typeof a === "string" ? a : a.slug;
      const valB = typeof b === "string" ? b : b.slug;

      const indexA = sizeOrder.indexOf(valA.toUpperCase());
      const indexB = sizeOrder.indexOf(valB.toUpperCase());

      const isNumA = !isNaN(Number(valA));
      const isNumB = !isNaN(Number(valB));

      if (!isNumA && !isNumB) {
        // Both are letters
        return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
      } else if (isNumA && isNumB) {
        // Both are numbers
        return Number(valA) - Number(valB);
      } else {
        // One is letter, one is number — keep letters first
        return isNumA ? 1 : -1;
      }
    });
  };

  return (
    <Modal
      isVisible={visible}
      onSwipeComplete={onClose}
      swipeDirection="down"
      onBackdropPress={onClose}
      style={{ margin: 0, justifyContent: "flex-end" }}
      backdropOpacity={0.5}
      propagateSwipe
    >
      <View className="h-[90%] bg-Fdark rounded-t-2xl overflow-hidden">
        {/* Handle / notch */}
        <View className="items-center mt-2 mb-2">
          <View className="w-14 h-1.5 bg-gray-500 rounded-full" />
        </View>

        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#fff" />
          </View>
        ) : (
          <View className="flex-row flex-1">
            {/* Left: Filter categories */}
            <View className="w-1/3 bg-Fdark border-r border-white/10">
              {FILTER_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  className={`p-4 border-b border-white/10 ${
                    selectedCategory === cat ? "bg-white/10" : ""
                  }`}
                >
                  <Text
                    className={`capitalize ${
                      selectedCategory === cat ? "text-white" : "text-white/70"
                    }`}
                  >
                    {cat.replace("_", " ")}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Right: Filter values */}
            <View className="w-2/3 p-4 bg-Fdark">
              <View className="flex-row flex-wrap gap-x-2 gap-y-2">
                {(selectedCategory === "sizes"
                  ? sortSizes(
                      getValuesForCategory(selectedCategory) as string[]
                    )
                  : getValuesForCategory(selectedCategory)
                ).map((item) => {
                  const value = typeof item === "string" ? item : item.slug;
                  const label = typeof item === "string" ? item : item.name;
                  const isSelected =
                    selectedFilters[selectedCategory]?.includes(value);

                  return (
                    <TouchableOpacity
                      key={value}
                      onPress={() => toggleSelection(selectedCategory, value)}
                      className={`px-4 py-2 rounded-full border ${
                        isSelected
                          ? "bg-blue-600/30 border-blue-400"
                          : "border-white/20"
                      }`}
                    >
                      <Text
                        className={`text-sm ${
                          isSelected ? "text-white" : "text-white/80"
                        }`}
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {/* Bottom buttons */}
        <View className="flex-row justify-between p-4 border-t border-white/10 bg-Fdark">
          <TouchableOpacity
            onPress={() => {
              setSelectedFilters({});
              onApply({});
              onClose();
            }}
          >
            <Text className="text-red-400 text-base font-semibold">
              Reset Filters
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              const queryFilters: Record<string, string[]> = {};

              Object.entries(selectedFilters).forEach(([key, value]) => {
                if (!value?.length) return;

                const queryKey =
                  key === "categories"
                    ? "categories"
                    : key === "brands"
                      ? "brand"
                      : key === "colors"
                        ? "colors"
                        : key === "sizes"
                          ? "sizes"
                          : key === "target_audience"
                            ? "target_audience"
                            : key;

                queryFilters[queryKey] = value;
              });

              onApply(queryFilters); // pass corrected keys
              onClose();
            }}
          >
            <Text className="text-blue-400 text-base font-semibold">Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;
