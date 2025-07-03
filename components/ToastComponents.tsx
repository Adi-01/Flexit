import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export function SuccessToast({ text1 }: { text1: string }) {
  return (
    <View
      style={{
        backgroundColor: "rgba(0,0,0,0.9)",
        padding: 15,
        borderRadius: 12,
        marginHorizontal: 10,
        maxWidth: "90%",
        alignSelf: "center",
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
        borderLeftWidth: 6,
        borderLeftColor: "#16a34a",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: "white",
          fontFamily: "Rubik-Bold",
          fontSize: 14,
          marginBottom: 0,
        }}
      >
        {text1}
      </Text>
      <Feather
        name="check-circle"
        size={20}
        color="#16a34a"
        style={{ marginLeft: 10 }}
      />
    </View>
  );
}

export const ErrorToast = ({ text1 }: { text1: string }) => (
  <View
    style={{
      backgroundColor: "#dc2626", // Tailwind red-600
      padding: 15,
      borderRadius: 12,
      marginHorizontal: 10,
      maxWidth: "90%",
      alignSelf: "center",
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 5,
      flexDirection: "row",
      alignItems: "center",
    }}
  >
    <Text
      style={{
        color: "white",
        fontFamily: "Rubik-Bold",
        fontSize: 16,
      }}
    >
      {text1}
    </Text>
  </View>
);

// Similarly, add WarningToast, InfoToast, etc.
