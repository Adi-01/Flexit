// components/CustomModal.tsx
import React, { useEffect } from "react";
import { Dimensions, Modal, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { height } = Dimensions.get("window");

interface CustomModalProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  showCancel?: boolean;
  confirmText?: string;
  cancelText?: string;
}

const CustomModal = ({
  visible,
  title,
  message,
  onClose,
  onConfirm,
  showCancel = false,
  confirmText = "OK",
  cancelText = "Cancel",
}: CustomModalProps) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(height / 2);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withTiming(0, { duration: 300 });
    } else {
      opacity.value = withTiming(0, { duration: 300 });
      translateY.value = withTiming(height / 2, { duration: 300 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleClose = () => {
    opacity.value = withTiming(0, { duration: 300 });
    translateY.value = withTiming(height / 2, { duration: 300 }, (finished) => {
      if (finished) runOnJS(onClose)();
    });
  };

  const handleConfirm = () => {
    opacity.value = withTiming(0, { duration: 300 });
    translateY.value = withTiming(height / 2, { duration: 300 }, (finished) => {
      if (finished && onConfirm) runOnJS(onConfirm)();
    });
  };

  return (
    <Modal
      transparent
      animationType="none"
      visible={visible}
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/60 justify-center items-center px-6">
        <Animated.View
          style={animatedStyle}
          className="bg-neutral-900 w-full p-6 rounded-2xl border border-neutral-700"
        >
          <Text className="text-xl text-white mb-2 font-rubik-bold">
            {title}
          </Text>
          <Text className="text-white mb-5 text-lg mt-1 font-rubik">
            {message}
          </Text>

          <View className="flex-row justify-end gap-4">
            {showCancel && (
              <TouchableOpacity
                className="px-4 py-2 bg-neutral-700 rounded-lg"
                onPress={handleClose}
              >
                <Text className="text-white font-rubik-semibold">
                  {cancelText}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              className="px-4 py-2 bg-red-600 rounded-lg"
              onPress={handleConfirm}
            >
              <Text className="text-white font-rubik-semibold">
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default CustomModal;
