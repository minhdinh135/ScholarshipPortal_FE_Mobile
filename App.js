import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo, FontAwesome6 } from "@expo/vector-icons";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { Easing, Text } from "react-native";

import WelcomeScreen from "./src/screens/Authentication/WelcomeScreen";
import LoginScreen from "./src/screens/Authentication/LoginScreen";
import RegisterScreen from "./src/screens/Authentication/RegisterScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import HomeScreen from "./src/screens/HomeScreen";
import SearchScreen from "./src/screens/SearchScreen";
import ScholarshipListing from "./src/screens/List/ScholarshipListing";
import ScholarshipDetail from "./src/screens/List/ScholarshipDetail";
import UserList from "./src/components/Chat/UserList";
import Chat from "./src/components/Chat/Chat";
import MultiStepForm from "./src/screens/Applicant/MultiStepForm";

import { COLORS } from "./src/constants";
import { useFonts } from "expo-font";

const Tab = createBottomTabNavigator();
const Stack = createSharedElementStackNavigator();

const options = {
  headerShown: false,
  gestureEnabled: false,
  transitionSpec: {
    open: {
      animation: 'timing',
      config: { duration: 300, easing: Easing.inOut(Easing.ease) }
    },
    close: {
      animation: 'timing',
      config: { duration: 300, easing: Easing.inOut(Easing.ease) }
    },
    cardStyleInterpolator: ({ current: { progress } }) => {
      return {
        cardStyle: {
          opacity: progress
        }
      }
    }
  }
}

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator defaultScreenOptions={HomeScreen}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ScholarshipListing" component={ScholarshipListing} options={() => options} />
      <Stack.Screen name="ScholarDetail" component={ScholarshipDetail} options={{ headerShown: false }} />
      <Stack.Screen name="MultiStep" component={MultiStepForm} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

function SearchStack() {
  return (
    <Stack.Navigator defaultScreenOptions={SearchScreen}>
      <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ScholarshipListing" component={ScholarshipListing} options={() => options} />
      <Stack.Screen name="ScholarDetail" component={ScholarshipDetail} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

function ChatStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserListScreen" component={UserList} options={{ headerShown: false }} />
      <Stack.Screen name="ChatScreen" component={Chat} options={{ headerShown: true }} />
    </Stack.Navigator>
  )
}

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <Entypo name="home" size={20} color={focused ? COLORS.primary : COLORS.gray30} />
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: focused ? COLORS.primary : COLORS.gray30 }}>Home</Text>
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <Entypo name="magnifying-glass" size={20} color={focused ? COLORS.primary : COLORS.gray30} />
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: focused ? COLORS.primary : COLORS.gray30 }}>Search</Text>
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <Entypo name="chat" size={20} color={focused ? COLORS.primary : COLORS.gray30} />
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: focused ? COLORS.primary : COLORS.gray30 }}>Chat</Text>
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <FontAwesome6 name="user-large" size={20} color={focused ? COLORS.primary : COLORS.gray30} />
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: focused ? COLORS.primary : COLORS.gray30 }}>Profile</Text>
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
  const [fontsLoaded] = useFonts({
    'Roboto-Black': require('./src/assets/fonts/Roboto-Black.ttf'),
    'Roboto-Bold': require('./src/assets/fonts/Roboto-Bold.ttf'),
    'Roboto-Regular': require('./src/assets/fonts/Roboto-Regular.ttf'),
  });

  if (!fontsLoaded) {
    // return <AppLoading />;
    return undefined;
  }

  return (
    <>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </>
  );
}
