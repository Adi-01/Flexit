import SearchBar from "@/components/SearchBar";
import { useDebounce } from "@/hooks/useDebounce";
import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const fetchSuggestions = async (query: string) => {
  const res = await axiosInstance.get(`/products/suggest-keywords/?q=${query}`);
  return res.data;
};

const Search = () => {
  const [input, setInput] = useState("");
  const debouncedInput = useDebounce(input);
  const router = useRouter();

  const { data: suggestions = [] } = useQuery({
    queryKey: ["suggestions", debouncedInput],
    queryFn: () => fetchSuggestions(debouncedInput),
    enabled: debouncedInput.trim().length > 0,
  });

  const handleSearch = () => {
    if (input.trim()) {
      router.push({
        pathname: "/search/search-results",
        params: { q: input.trim() },
      });
      setInput("");
    }
  };

  const handleSuggestionPress = (keywords: string) => {
    router.push({
      pathname: "/search/search-results",
      params: { q: keywords },
    });
    setInput("");
  };

  return (
    <SafeAreaView className="flex-1 bg-Fdark px-4">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="mt-5"
      >
        <SearchBar
          onSearch={setInput}
          onSubmit={handleSearch}
          value={input}
          autoFocus
        />
      </KeyboardAvoidingView>

      {input.trim().length > 0 && suggestions.length > 0 && (
        <View className="bg-Fdark border border-neutral-700 rounded-xl mt-2 overflow-hidden z-50">
          {suggestions.map((title: string) => (
            <TouchableOpacity
              key={title}
              onPress={() => handleSuggestionPress(title)}
              className="px-4 py-3 border-b border-neutral-800"
            >
              <Text className="text-white font-rubik">{title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};

export default Search;
