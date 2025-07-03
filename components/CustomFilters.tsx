import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
      <View className="h-[90%] bg-white rounded-t-2xl overflow-hidden">
        {/* Handle / notch */}
        <View className="items-center mt-2 mb-2">
          <View className="w-14 h-1.5 bg-gray-400 rounded-full" />
        </View>

        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <View className="flex-row flex-1">
            {/* Left: Filter categories */}
            <View className="w-1/3 bg-gray-100">
              {FILTER_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  className={`p-4 border-b ${
                    selectedCategory === cat ? "bg-white" : ""
                  }`}
                >
                  <Text className="capitalize">{cat.replace("_", " ")}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Right: Filter values */}
            <View className="w-2/3 p-4">
              <FlatList
                data={getValuesForCategory(selectedCategory)}
                keyExtractor={(item) =>
                  typeof item === "string" ? item : (item as Brand).slug
                }
                renderItem={({ item }) => {
                  const value =
                    typeof item === "string" ? item : (item as Brand).slug;
                  const label =
                    typeof item === "string" ? item : (item as Brand).name;

                  const isSelected =
                    selectedFilters[selectedCategory]?.includes(value);

                  return (
                    <TouchableOpacity
                      className={`p-2 mb-2 border rounded ${
                        isSelected ? "bg-blue-200" : ""
                      }`}
                      onPress={() => toggleSelection(selectedCategory, value)}
                    >
                      <Text>{label}</Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        )}

        {/* Bottom buttons */}
        <View className="flex-row justify-between p-4 border-t bg-white">
          <TouchableOpacity onPress={() => setSelectedFilters({})}>
            <Text className="text-red-600 text-base">Reset Filters</Text>
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
            <Text className="text-blue-600 text-base">Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;
