import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import HomeScreen from "./screens/HomeScreen";
import TestScreen from "./screens/SearchScreen";
import { Entypo, FontAwesome6 } from "@expo/vector-icons";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Create stack and tab navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Authentication stack for Login/Register
function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

// Main stack including Home, Friends, Chats, etc.
// function HomeStack() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="Home" component={HomeScreen} />
//       <Stack.Screen name="Friends" component={FriendsScreen} />
//       <Stack.Screen name="Chats" component={ChatsScreen} />
//       <Stack.Screen name="Messages" component={ChatMessagesScreen} />
//     </Stack.Navigator>
//   );
// }

// Bottom tab navigator with just Home and Profile
function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Test"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Entypo name="home" size={20} color={focused ? "blue" : "gray"} />
          ),
          headerShown: false,

        }}
      />
      <Tab.Screen
        name="Home"
        component={TestScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Entypo name="magnifying-glass" size={20} color={focused ? "blue" : "gray"} />
          ),
          headerShown: false,

        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <FontAwesome6 name="user-large" size={20} color={focused ? "blue" : "gray"} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AppContent() {
  const { isLoggedIn } = useAuth();

  return (
    <>
      <NavigationContainer>
        {isLoggedIn ? <MainTabs /> : <AuthStack />}
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </>
  );
}
