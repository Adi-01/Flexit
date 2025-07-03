import { useAuth } from "@/lib/auth/AuthContext";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ✅ Import OTP component
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import Toast from "react-native-toast-message";

const CELL_COUNT = 6;

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");

  const [sendingOTP, setSendingOTP] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  const { loading, loginWithOTP, requestOTP, getCurrentUser } = useAuth();

  const ref = useBlurOnFulfill({ value: otp, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: otp,
    setValue: setOtp,
  });

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (step === "otp" && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handleRequestOTP = async () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(trimmedEmail)) {
      return Alert.alert(
        "Invalid email",
        "Only @gmail.com addresses are supported."
      );
    }

    try {
      setSendingOTP(true);
      const res = await requestOTP(trimmedEmail);
      if (res.status === 200 && res.data.message === "OTP sent successfully") {
        Toast.show({
          type: "success",
          text1: "OTP sent to your email.",
        });
        setStep("otp");
        setResendTimer(60);
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Failed to send OTP.";
      Toast.show({ type: "error", text1: message });
    } finally {
      setSendingOTP(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return Alert.alert("Invalid OTP");
    const trimmedEmail = email.trim().toLowerCase();

    try {
      const result = await loginWithOTP(trimmedEmail, otp);
      if (result.status === "signup_required") {
        router.replace({
          pathname: "/finish-sign-in",
          params: { trimmedEmail, code: otp },
        });
      } else {
        await getCurrentUser();
        router.replace("/");
      }
    } catch {
      // already handled
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=720&auto=format&fit=crop",
      }}
      className="flex-1 w-full h-full justify-center px-3"
      resizeMode="cover"
    >
      <View className="bg-black/80 p-14 rounded-2xl">
        {step === "email" ? (
          <>
            <Text className="text-2xl font-rubik-bold text-center mb-5 text-white">
              Let’s get started
            </Text>
            <TextInput
              className="border border-gray-300 p-3 rounded-md text-white font-rubik-light"
              placeholder="Enter your email"
              placeholderTextColor="#999"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TouchableOpacity
              className="mt-6 bg-discount py-3 rounded-xl w-full"
              onPress={handleRequestOTP}
              disabled={sendingOTP}
            >
              <Text className="text-white text-center font-rubik-semibold">
                {sendingOTP ? "Sending OTP..." : "Send OTP"}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text className="text-2xl font-rubik-bold text-center mb-4 text-white">
              Verify your mail
            </Text>

            <View className="mb-4">
              <Text className="text-white text-center text-sm font-rubik-light">
                We&apos;ve sent a code to
              </Text>

              <Text className="text-white text-center text-sm font-rubik-bold mt-1">
                {email}
              </Text>

              <Text
                className="text-yellow-300 text-center underline text-sm font-rubik mt-1"
                onPress={() => setStep("email")}
              >
                Not correct? Change
              </Text>
            </View>

            <CodeField
              ref={ref}
              {...props}
              value={otp}
              onChangeText={setOtp}
              cellCount={CELL_COUNT}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              rootStyle={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
              renderCell={({ index, symbol, isFocused }) => (
                <View
                  key={index}
                  onLayout={getCellOnLayoutHandler(index)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    borderWidth: 2,
                    borderColor: isFocused ? "#ffffff" : "#ccc",
                    justifyContent: "center",
                    alignItems: "center",
                    marginHorizontal: 2,
                    marginLeft: -1,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 24,
                      color: "white",
                      fontFamily: "Rubik-Bold",
                    }}
                  >
                    {symbol || (isFocused ? <Cursor /> : "")}
                  </Text>
                </View>
              )}
            />

            <TouchableOpacity
              className="mt-6 bg-discount py-3 rounded-xl"
              onPress={handleVerifyOTP}
              disabled={loading}
            >
              <Text className="text-white text-center font-rubik-semibold">
                {loading ? "Verifying..." : "Continue"}
              </Text>
            </TouchableOpacity>

            <View className="mt-4 items-center">
              {resendTimer > 0 ? (
                <Text className="text-gray-400 font-rubik-light">
                  Resend OTP in {resendTimer}s
                </Text>
              ) : (
                <TouchableOpacity
                  onPress={handleRequestOTP}
                  className="py-2 px-4 mt-3 rounded-xl bg-white/30 border border-white/30"
                >
                  <Text className="text-white text-center font-rubik-light">
                    Resend OTP
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </View>
    </ImageBackground>
  );
}
