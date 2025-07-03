import icons from "@/constants/icons";
import axiosInstance from "@/lib/axiosInstance";
import { AddressType } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "expo-checkbox"; // if not installed: expo install expo-checkbox
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const fetchAddresses = async (): Promise<AddressType[]> => {
  const res = await axiosInstance.get("users/addresses/");
  return res.data;
};

const addAddress = async (data: Omit<AddressType, "id" | "user">) => {
  const res = await axiosInstance.post("users/addresses/", data);
  return res.data;
};

const editAddress = async ({
  id,
  data,
}: {
  id: number;
  data: Omit<AddressType, "id" | "user">;
}) => {
  const res = await axiosInstance.put(`users/addresses/${id}/`, data);
  return res.data;
};

const deleteAddress = async (id: number) => {
  await axiosInstance.delete(`users/addresses/${id}/`);
};

export default function SavedAddress() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<AddressType, "id" | "user">>({
    full_name: "",
    phone: "",
    address_line: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
    is_default: false,
  });

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ["userAddresses"],
    queryFn: fetchAddresses,
    staleTime: 1000 * 60 * 10,
  });

  const queryKey = { queryKey: ["userAddresses"] };

  const { mutate: saveAddress, isPending } = useMutation({
    mutationFn: addAddress,
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
      setShowForm(false);
      Alert.alert("Success", "Address added.");
      resetForm();
    },
    onError: () => {
      Alert.alert("Error", "Could not add address.");
    },
  });

  const { mutate: updateAddress } = useMutation({
    mutationFn: editAddress,
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
      setShowForm(false);
      setEditingAddressId(null);
      Alert.alert("Success", "Address updated.");
      resetForm();
    },
    onError: () => {
      Alert.alert("Error", "Could not update address.");
    },
  });

  const { mutate: removeAddress } = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
      Alert.alert("Deleted", "Address has been removed.");
    },
  });

  const resetForm = () => {
    setForm({
      full_name: "",
      phone: "",
      address_line: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
      is_default: false,
    });
    setEditingAddressId(null);
  };

  const handleInput = (key: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const required: (keyof typeof form)[] = [
      "full_name",
      "phone",
      "address_line",
      "city",
      "state",
      "country",
      "postal_code",
    ];

    for (let field of required) {
      if (!form[field]?.toString().trim()) {
        return Alert.alert(
          "Validation",
          `${field.replace("_", " ")} is required`
        );
      }
    }

    const isDuplicate = addresses.some(
      (addr) =>
        (addr.full_name.trim().toLowerCase() ===
          form.full_name.trim().toLowerCase() ||
          addr.phone.trim() === form.phone.trim()) &&
        addr.id !== editingAddressId
    );

    if (isDuplicate) {
      return Alert.alert(
        "Duplicate Entry",
        "This name or phone number is already used for another address."
      );
    }

    if (editingAddressId) {
      updateAddress({ id: editingAddressId, data: form });
    } else {
      saveAddress(form);
    }
  };

  const handleEdit = (addr: AddressType) => {
    setForm({
      full_name: addr.full_name,
      phone: addr.phone,
      address_line: addr.address_line,
      city: addr.city,
      state: addr.state,
      country: addr.country,
      postal_code: addr.postal_code,
      is_default: addr.is_default,
    });
    setEditingAddressId(addr.id);
    setShowForm(true);
  };

  const autofillAddress = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const [address] = await Location.reverseGeocodeAsync(location.coords);

      setForm((prev) => ({
        ...prev,
        city: address.city || "",
        state: address.region || "",
        country: address.country || "",
        postal_code: address.postalCode || "",
      }));
    } catch (error) {
      console.error("Location Error:", error);
      Alert.alert("Error", "Unable to fetch location.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-Fdark">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={icons.backArrow}
              className="size-8 ml-[-20px]"
              resizeMode="contain"
              tintColor="#fff"
            />
          </TouchableOpacity>
          <Text className="text-xl font-rubik-bold text-white text-center flex-1 ml-[20px]">
            My Saved Addresses
          </Text>
          <View className="w-6 h-6" />
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#facc15" />
        ) : showForm ? (
          <>
            {[
              "full_name",
              "phone",
              "address_line",
              "city",
              "state",
              "country",
              "postal_code",
            ].map((key) => (
              <TextInput
                key={key}
                className="bg-white/10 text-white p-3 rounded-lg font-rubik-light mb-3"
                placeholder={key.replace("_", " ")}
                placeholderTextColor="#ccc"
                value={form[key as keyof typeof form]?.toString()}
                onChangeText={(val) =>
                  handleInput(key as keyof typeof form, val)
                }
              />
            ))}

            <View className="flex-row items-center mb-4 space-x-2 gap-2">
              <Checkbox
                value={form.is_default}
                onValueChange={(val) => handleInput("is_default", val)}
                color={form.is_default ? "#facc15" : undefined}
              />
              <Text className="text-white font-rubik-medium">
                Set as Default Address
              </Text>
            </View>

            <TouchableOpacity
              className="bg-discount py-3 rounded-lg mt-1"
              onPress={autofillAddress}
            >
              <Text className="text-center text-white font-rubik-semibold">
                Use My Current Location
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-accent py-3 rounded-lg mt-2"
              onPress={handleSave}
              disabled={isPending}
            >
              <Text className="text-white text-center font-rubik-bold">
                {isPending
                  ? "Saving..."
                  : editingAddressId
                    ? "Update Address"
                    : "Save Address"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-3"
              onPress={() => {
                setShowForm(false);
                resetForm();
              }}
            >
              <Text className="text-center text-gray-300 underline font-rubik-medium">
                Cancel
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {addresses.length > 0 ? (
              addresses.map((addr) => (
                <View
                  key={addr.id}
                  className="bg-white/10 p-4 rounded-lg mt-5 space-y-1"
                >
                  <Text className="text-white font-rubik-semibold">
                    {addr.full_name} - {addr.phone}
                    {addr.is_default && (
                      <Text className="text-yellow-300 font-rubik-bold">
                        {"  "}⭐
                      </Text>
                    )}
                  </Text>
                  <Text className="text-white font-rubik-light">
                    {addr.address_line}
                  </Text>
                  <Text className="text-white font-rubik-light">
                    {addr.city}, {addr.state}
                  </Text>
                  <Text className="text-white font-rubik-light">
                    {addr.country} - {addr.postal_code}
                  </Text>

                  <View className="flex-row mt-3 space-x-3 gap-3">
                    <TouchableOpacity
                      className="bg-blue-500 px-3 py-2 rounded"
                      onPress={() => handleEdit(addr)}
                    >
                      <Text className="text-white font-rubik-semibold">
                        Edit
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="bg-red-600 px-3 py-2 rounded"
                      onPress={() => {
                        if (addr.is_default && addresses.length > 1) {
                          Alert.alert(
                            "Default Address",
                            "Please set another address as default before deleting this one."
                          );
                          return;
                        }

                        Alert.alert("Confirm", "Delete this address?", [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Delete",
                            style: "destructive",
                            onPress: () => removeAddress(addr.id),
                          },
                        ]);
                      }}
                    >
                      <Text className="text-white font-rubik-semibold">
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <Text className="text-white mt-5 font-rubik-light text-center">
                No addresses saved yet.
              </Text>
            )}

            <TouchableOpacity
              className="bg-accent py-3 rounded-lg mt-6"
              onPress={() => setShowForm(true)}
            >
              <Text className="text-white text-center font-rubik-bold">
                Add New Address
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
