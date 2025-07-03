import icons from "@/constants/icons";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Image,
  TextInput as RNTextInput,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  value?: string;
  onSearch?: (text: string) => void;
  onSubmit?: () => void;
  readOnly?: boolean;
  onPressReadOnly?: () => void;
  autoFocus?: boolean;
};

const SearchBar = ({
  value = "",
  onSearch,
  onSubmit,
  readOnly = false,
  onPressReadOnly,
  autoFocus = false,
}: Props) => {
  const inputRef = useRef<RNTextInput>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current && !readOnly) {
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 100); // Slight delay ensures keyboard opens after screen mount
      return () => clearTimeout(timeout);
    }
  }, [autoFocus, readOnly]);

  return (
    <TouchableOpacity
      activeOpacity={readOnly ? 0.7 : 1}
      onPress={readOnly && onPressReadOnly ? onPressReadOnly : undefined}
      className="flex flex-row items-center justify-between w-full px-4 rounded-full bg-Fdark border border-white"
    >
      <View className="flex-1 flex flex-row items-center justify-start z-50">
        <Image source={icons.search} className="size-5" tintColor={"#fff"} />
        <TextInput
          ref={inputRef}
          placeholder="Search for anything"
          className="text-sm font-rubik text-white ml-2 flex-1 mt-1.5"
          placeholderTextColor="#fff"
          onChangeText={onSearch}
          onSubmitEditing={onSubmit}
          returnKeyType="search"
          value={value}
          editable={!readOnly}
        />

        {/* ❌ Clear input button */}
        {!readOnly && value?.trim().length > 0 && (
          <TouchableOpacity onPress={() => onSearch?.("")}>
            <Ionicons
              name="close-circle"
              size={20}
              color="#fff"
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default SearchBar;
