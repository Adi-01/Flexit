import { Stack } from "expo-router";
import { View } from "react-native";

export default function ProfileLayout() {
  return (
    <View className="flex-1 bg-Fdark">
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
    </View>
  );
}
