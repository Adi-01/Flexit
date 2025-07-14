import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const BUTTON_WIDTH = width - 32;
const SLIDE_WIDTH = BUTTON_WIDTH - 60;

const SlideToCheckout = ({
  onSuccess,
  disabled = false,
}: {
  onSuccess: () => void;
  disabled?: boolean;
}) => {
  const translateX = useSharedValue(0);
  const completed = useRef(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (!completed.current) {
        translateX.value = Math.min(Math.max(0, e.translationX), SLIDE_WIDTH);
      }
    })
    .onEnd(() => {
      if (translateX.value > SLIDE_WIDTH * 0.9) {
        translateX.value = withSpring(SLIDE_WIDTH, { damping: 12 }, () => {
          runOnJS(setIsCompleted)(true);
          runOnJS(onSuccess)();
          completed.current = true;
        });
      } else {
        translateX.value = withSpring(0, { damping: 12 });
      }
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    width: translateX.value + 56,
  }));

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.fill, fillStyle]} />
      <Text style={styles.label} className="font-rubik-medium">
        {isCompleted ? "Processing...." : "Slide to Checkout"}
      </Text>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.thumb, thumbStyle]}>
          <Ionicons
            name={isCompleted ? "checkmark" : "arrow-forward"}
            size={24}
            color={"#4CAF50"}
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: BUTTON_WIDTH,
    height: 56,
    backgroundColor: "rgba(127,127,127,0.7)",
    borderRadius: 28,
    overflow: "hidden",
    justifyContent: "center",
    marginHorizontal: 16,
    position: "relative",
  },
  label: {
    position: "absolute",
    alignSelf: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    zIndex: 1,
  },
  fill: {
    position: "absolute",
    height: 56,
    backgroundColor: "#4CAF50",
    borderRadius: 28,
    left: 0,
    top: 0,
    zIndex: 0,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
});

export default SlideToCheckout;
