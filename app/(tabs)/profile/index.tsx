import CustomModal from "@/components/customModal";
import { settings } from "@/constants/data";
import icons from "@/constants/icons";
import { useAuth } from "@/lib/auth/AuthContext";
import { SettingsItemProps } from "@/types/types";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const SettingsItem = ({
  icon,
  title,
  onPress,
  textStyle,
  showArrow = true,
  tintColor,
}: SettingsItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex flex-row items-center justify-between py-3"
  >
    <View className="flex flex-row items-center gap-3">
      <Image source={icon} className="size-6" tintColor={tintColor ?? "#fff"} />
      <Text
        className={`text-[15px] pt-1 ml-1 font-rubik-medium  ${
          textStyle ?? "text-white"
        }`}
      >
        {title}
      </Text>
    </View>
    {showArrow && (
      <Image
        source={icons.rightArrow}
        className="size-5 mt-0.5"
        tintColor={"#fff"}
      />
    )}
  </TouchableOpacity>
);

const Profile = () => {
  const { user, logout } = useAuth();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const confirmLogout = async () => {
    setLogoutModalVisible(false);
    try {
      await logout();
      Toast.show({
        type: "success",
        text1: "Logged out successfully",
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "An error occurred while logging out",
      });
    }
  };

  return (
    <SafeAreaView className="bg-Fdark h-full">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 px-7"
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.push("/")}>
            <Image
              source={icons.backArrow}
              className="size-8 ml-[-20px]"
              resizeMode="contain"
              tintColor={"#fff"}
            />
          </TouchableOpacity>

          <Text className="text-xl font-rubik-bold text-white text-center flex-1 ml-[20px]">
            My Profile
          </Text>

          <View className="w-6 h-6" />
        </View>

        <View className="flex-row justify-center flex mt-5">
          <View className="flex flex-col items-center relative mt-5">
            <Image
              source={{
                uri: user?.image_url?.startsWith("http")
                  ? user.image_url
                  : `http://192.168.5.79:8000${user?.image_url}`,
              }}
              className="size-40 relative rounded-full mt-2"
            />

            <Text className="text-xl font-rubik-bold mt-4 text-white">
              {user?.username}
            </Text>
          </View>
        </View>

        <Text className="text-base text-white font-rubik-light mt-10">
          My Account
        </Text>
        <View className="flex flex-col mt-5 border border-neutral-700 px-4 py-2 rounded-xl ">
          {settings.slice(0, 3).map((item, index) => (
            <SettingsItem
              key={index}
              {...item}
              onPress={() => {
                if (item.route) {
                  router.push(item.route as any);
                }
              }}
            />
          ))}
        </View>

        <Text className="text-base text-white font-rubik-light mt-5">
          Other Information
        </Text>
        <View className="flex flex-col mt-5 border-t border border-neutral-700 px-4 py-2 rounded-xl ">
          {settings.slice(3).map((item, index) => (
            <SettingsItem
              key={index}
              {...item}
              showArrow={item.arrowShown}
              onPress={() => {
                if (item.route) {
                  router.push(item.route as any);
                }
              }}
            />
          ))}
          <SettingsItem
            icon={icons.logout}
            title="Logout"
            onPress={() => setLogoutModalVisible(true)}
            tintColor="#EA2F14"
          />
        </View>
      </ScrollView>

      <CustomModal
        visible={logoutModalVisible}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        showCancel
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={confirmLogout}
        onClose={() => setLogoutModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default Profile;
