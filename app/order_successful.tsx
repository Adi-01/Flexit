import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SuccessOrderScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-Fdark px-6">
      {/* Success Animation */}
      <LottieView
        source={require("@/assets/animations/Success.json")}
        autoPlay
        loop={false}
        style={{ width: 300, height: 300 }}
      />

      {/* Success Text */}
      <Text className="text-white text-2xl font-rubik-bold mb-2 text-center">
        Order Placed Successfully!
      </Text>
      <Text className="text-white/70 text-base font-rubik-light mb-10 text-center">
        Thank you for shopping with us.
      </Text>

      {/* Buttons */}
      <View className="w-full gap-5">
        <TouchableOpacity
          className="bg-light/60 py-3 rounded-xl"
          onPress={() => router.replace("/")}
        >
          <Text className="text-center text-white font-rubik-semibold text-base">
            Go to Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-accent py-3 rounded-xl"
          onPress={() => router.replace("/profile/my-orders")}
        >
          <Text className="text-center text-white font-rubik-semibold text-base">
            View My Orders
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
