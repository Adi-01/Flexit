import { router } from "expo-router";
import React from "react";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";

const OnBoarding = () => {
  const handleOnboarding = () => {
    router.push("/sign-in");
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=720&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      }}
      className="flex-1 w-full h-full justify-end"
      resizeMode="cover"
    >
      <View className="px-6 py-10 pb-10 bg-black/80 rounded-[30px]">
        <Text className="text-lg text-center uppercase font-rubik text-white mb-2">
          Welcome to Flex-it
        </Text>
        <Text className="text-3xl font-rubik-bold text-white text-center mt-2">
          Discover Clothes That {"\n"}
          <Text className="text-primary-300">Defines You</Text>
        </Text>

        <View className="items-center justify-center mt-6 mb-5">
          <TouchableOpacity
            onPress={handleOnboarding}
            className="bg-accent rounded-full w-[250px] py-4 mt-5"
          >
            <View className="flex flex-row items-center justify-center gap-3">
              <Text className="font-rubik-medium text-white text-lg">
                Let’s Get You Styled
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default OnBoarding;
