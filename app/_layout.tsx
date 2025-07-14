import { SuccessToast } from "@/components/ToastComponents";
import { AuthProvider } from "@/lib/auth/AuthContext";
import queryClient from "@/lib/queryClient";
import { StripeProvider } from "@stripe/stripe-react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import "./globals.css";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Rubik-Bold": require("../assets/fonts/Rubik-Bold.ttf"),
    "Rubik-ExtraBold": require("../assets/fonts/Rubik-ExtraBold.ttf"),
    "Rubik-Light": require("../assets/fonts/Rubik-Light.ttf"),
    "Rubik-Medium": require("../assets/fonts/Rubik-Medium.ttf"),
    "Rubik-Regular": require("../assets/fonts/Rubik-Regular.ttf"),
    "Rubik-SemiBold": require("../assets/fonts/Rubik-SemiBold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* 👈 WRAP EVERYTHING */}
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <View className="flex-1 bg-Fdark">
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: "slide_from_right",
                }}
              />
              <Toast
                position="bottom"
                visibilityTime={3000}
                bottomOffset={60}
                config={{
                  success: ({ text1 }) => (
                    <SuccessToast text1={text1 || "Success"} />
                  ),
                }}
              />
            </View>
          </AuthProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </StripeProvider>
  );
}
