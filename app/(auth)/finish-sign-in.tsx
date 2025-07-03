import { useAuth } from "@/lib/auth/AuthContext";
import axiosInstance from "@/lib/axiosInstance";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CompleteSignup() {
  const router = useRouter();
  const { trimmedEmail, code } = useLocalSearchParams<{
    trimmedEmail: string;
    code: string;
  }>();
  const { getCurrentUser } = useAuth();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCompleteSignup = async () => {
    if (!username.trim()) {
      Alert.alert("Username Required", "Please enter a username.");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post("users/auth/complete-signup/", {
        email: trimmedEmail,
        code,
        username,
      });

      const { access, refresh } = res.data;

      await SecureStore.setItemAsync("accessToken", access);
      await SecureStore.setItemAsync("refreshToken", refresh);
      await getCurrentUser();

      Alert.alert("Success", "Signup complete. You are now logged in.");
      router.replace("/");
    } catch (err: any) {
      console.error("Signup error", err);
      Alert.alert(
        "Signup Failed",
        err?.response?.data?.error ||
          err?.response?.data?.username?.[0] ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=720&auto=format&fit=crop",
      }}
      className="flex-1 w-full h-full justify-center px-3"
      resizeMode="cover"
    >
      <View className="bg-black/80 p-14 rounded-2xl items-center justify-center w-full">
        <Text className="text-2xl font-rubik-bold text-center mb-6 text-white">
          Complete Signup
        </Text>

        <TextInput
          className="w-full border border-gray-300 rounded-md px-4 py-3 mb-6 text-white font-rubik-light bg-light/40"
          placeholder="Choose a username"
          placeholderTextColor="#ddd"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TouchableOpacity
          disabled={loading}
          onPress={handleCompleteSignup}
          className={`w-full py-3 rounded-xl ${
            loading ? "bg-white/20" : "bg-discount"
          }`}
        >
          <Text className="text-white text-center font-rubik-semibold text-base">
            {loading ? "Signing up..." : "Continue"}
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
