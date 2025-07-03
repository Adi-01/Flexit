import { useAuth } from "@/lib/auth/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs, useSegments } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, Image, View } from "react-native";

function TabIcon({ focused, name }: { focused: boolean; name: string }) {
  const iconName = focused ? name.replace("-outline", "") : name;

  return (
    <Ionicons
      name={iconName as any}
      size={21}
      color={focused ? "#FFFFFF" : "#FFF8F8"}
    />
  );
}

function ProfileTabIcon({
  focused,
  avatarUri,
}: {
  focused: boolean;
  avatarUri?: string | null;
}) {
  return (
    <View
      style={{
        width: 24,
        height: 24,
        borderRadius: 50,
        overflow: "hidden",
        borderWidth: 1.5,
        borderColor: focused ? "#ffffff" : "transparent",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={{
          uri:
            avatarUri ??
            "https://api.dicebear.com/7.x/initials/png?seed=Flexit",
        }}
        className="size-[20px] rounded-full"
        resizeMode="cover"
      />
    </View>
  );
}

export default function TabsLayout() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const shouldHideTabBar = useMemo(() => {
    return (
      Array.isArray(segments) &&
      segments[0] === "(tabs)" &&
      segments[1] === "profile" &&
      segments.length > 2
    );
  }, [segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (user === null) {
    return <Redirect href="/on-boarding" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: shouldHideTabBar
          ? { display: "none" }
          : {
              backgroundColor: "rgb(64,64,64)",
              height: 55,
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              borderTopWidth: 0,
              elevation: 0,
              shadowOpacity: 0,
            },
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name="home-outline" />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name="search-outline" />
          ),
        }}
      />

      <Tabs.Screen
        name="saved"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name="bookmark-outline" />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <ProfileTabIcon
              focused={focused}
              avatarUri={
                user?.image_url?.startsWith("http")
                  ? user.image_url
                  : `http://192.168.5.79:8000${user?.image_url}`
              }
            />
          ),
        }}
      />
    </Tabs>
  );
}
