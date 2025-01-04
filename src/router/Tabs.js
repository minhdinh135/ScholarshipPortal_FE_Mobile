import React from "react";
import { Entypo, FontAwesome6 } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { COLORS } from "../constants";
import useUnreadNotifications from "../hooks/useUnreadNotifications";
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen"
import NotificationScreen from "../screens/Profile/NotificationScreen";
import { useAuth } from "../context/AuthContext";
import ServiceList from "../screens/Service/ServiceList";
import ScholarshipListScreen from "../screens/Expert/ScholarshipListScreen";

const Tab = createBottomTabNavigator();

const tabBarLabel = (focused, label) => (
  <Text style={{ color: focused ? COLORS.primary : COLORS.gray30, fontSize: 12 }}>
    {label}
  </Text>
);

const tabBarIcon = (focused, IconComponent, iconProps) => (
  <IconComponent {...iconProps} size={22} color={focused ? COLORS.primary : COLORS.gray30} />
);

function HomeTabs() {
  const { userInfo } = useAuth();
  const unreadCount = useUnreadNotifications(userInfo?.id);

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => tabBarIcon(focused, Entypo, { name: "home" }),
          tabBarLabel: ({ focused }) => tabBarLabel(focused, "Home"),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ focused }) => tabBarIcon(focused, Entypo, { name: "magnifying-glass" }),
          tabBarLabel: ({ focused }) => tabBarLabel(focused, "Search"),
        }}
      />
      <Tab.Screen
        name="Services"
        component={ServiceList}
        options={{
          tabBarIcon: ({ focused }) => tabBarIcon(focused, Entypo, { name: "chat" }),
          tabBarLabel: ({ focused }) => tabBarLabel(focused, "Services"),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <FontAwesome6 name="bell" size={22} color={focused ? COLORS.primary : COLORS.gray30} />
              {unreadCount > 0 && (
                <View style={{
                  position: 'absolute', right: -5, top: -3, backgroundColor: 'red', borderRadius: 8,
                  width: 16, height: 16, justifyContent: 'center', alignItems: 'center'
                }}>
                  <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                    {unreadCount}
                  </Text>
                </View>
              )}
            </View>
          ),
          tabBarLabel: ({ focused }) => tabBarLabel(focused, "Notifications"),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => tabBarIcon(focused, FontAwesome6, { name: "user-large" }),
          tabBarLabel: ({ focused }) => tabBarLabel(focused, "Me"),
        }}
      />
    </Tab.Navigator>
  );
}

function ExpertTabs() {
  const { userInfo } = useAuth();
  const unreadCount = useUnreadNotifications(userInfo?.id);

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Applications"
        component={ScholarshipListScreen}
        options={{
          tabBarIcon: ({ focused }) => tabBarIcon(focused, Entypo, { name: "list" }),
          tabBarLabel: ({ focused }) => tabBarLabel(focused, "Applications"),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <FontAwesome6 name="bell" size={22} color={focused ? COLORS.primary : COLORS.gray30} />
              {unreadCount > 0 && (
                <View style={{
                  position: 'absolute', right: -5, top: -3, backgroundColor: 'red', borderRadius: 8,
                  width: 16, height: 16, justifyContent: 'center', alignItems: 'center'
                }}>
                  <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                    {unreadCount}
                  </Text>
                </View>
              )}
            </View>
          ),
          tabBarLabel: ({ focused }) => tabBarLabel(focused, "Notifications"),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => tabBarIcon(focused, FontAwesome6, { name: "user-large" }),
          tabBarLabel: ({ focused }) => tabBarLabel(focused, "Me"),
        }}
      />
    </Tab.Navigator>
  );
}

export { HomeTabs, ExpertTabs };
