import icons from "@/constants/icons";
import { useAuth } from "@/lib/auth/AuthContext";
import axiosInstance from "@/lib/axiosInstance";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfile() {
  const { user, getCurrentUser } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [mobile, setMobile] = useState(user?.mobile || "");
  const [image, setImage] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  const handleChooseImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [1, 1],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleSave = async () => {
    if (!username.trim())
      return Alert.alert("Validation", "Username is required.");

    const formData = new FormData();
    formData.append("username", username);
    formData.append("mobile", mobile);

    if (image) {
      const localUri = image.uri;
      const filename = localUri.split("/").pop() || "profile.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append("image", {
        uri: localUri,
        name: filename,
        type,
      } as any);
    }

    try {
      setUploading(true);
      await axiosInstance.put("users/auth/update/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await getCurrentUser();
      Alert.alert("Success", "Profile updated.");
      router.back();
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Failed to update profile.";
      Alert.alert("Error", message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-Fdark px-4">
      <View className="flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={icons.backArrow}
            className="size-8 ml-[-20px]"
            resizeMode="contain"
            tintColor={"#fff"}
          />
        </TouchableOpacity>

        <Text className="text-xl font-rubik-bold text-white text-center flex-1 ml-[20px]">
          Edit Profile
        </Text>

        <View className="w-6 h-6" />
      </View>

      <TouchableOpacity
        onPress={handleChooseImage}
        className="items-center mb-4 mt-5"
      >
        <Image
          source={{
            uri: image
              ? image.uri
              : user?.image_url?.startsWith("http")
                ? user.image_url
                : `http://192.168.5.79:8000${user?.image_url}`,
          }}
          className="w-28 h-28 rounded-full bg-white/10"
        />

        <Text className="text-white mt-2 font-rubik-medium">
          tap to change photo
        </Text>
      </TouchableOpacity>

      <TextInput
        className="bg-white/10 text-white p-3 rounded-lg font-rubik-light mb-3"
        placeholder="Username"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        className="bg-white/10 text-white p-3 rounded-lg font-rubik-light mb-5"
        placeholder="Mobile"
        placeholderTextColor="#aaa"
        keyboardType="phone-pad"
        value={mobile}
        onChangeText={setMobile}
      />

      <TouchableOpacity
        onPress={handleSave}
        disabled={uploading}
        className="bg-accent py-3 rounded-xl"
      >
        <Text className="text-white font-rubik-bold text-center text-lg">
          {uploading ? "Updating..." : "Save Changes"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
