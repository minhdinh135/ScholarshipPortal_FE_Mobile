import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo, FontAwesome6 } from "@expo/vector-icons";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { Easing, Text, View } from "react-native";

import WelcomeScreen from "./src/screens/Authentication/WelcomeScreen";
import LoginScreen from "./src/screens/Authentication/LoginScreen";
import RegisterScreen from "./src/screens/Authentication/RegisterScreen";
import ProfileScreen from "./src/screens/Profile/ProfileScreen";
import HomeScreen from "./src/screens/HomeScreen";
import SearchScreen from "./src/screens/SearchScreen";
import ScholarshipListing from "./src/screens/Scholarship/ScholarshipListing";
import ScholarshipDetail from "./src/screens/Scholarship/ScholarshipDetail";
import UserList from "./src/components/Chat/UserList";
import Chat from "./src/components/Chat/Chat";
import MultiStepForm from "./src/screens/Applicant/MultiStepForm";
import NotificationScreen from "./src/screens/Profile/NotificationScreen";
import ServiceList from "./src/screens/Service/ServiceList";
import ServiceDetail from "./src/screens/Service/ServiceDetail";
import ServiceForm from "./src/components/Service/ServiceForm";
import PaymentScreen from "./src/screens/Payment/PaymentScreen"

import HistoryScreen from "./src/screens/Profile/HistoryScreen";

import { COLORS } from "./src/constants";
import { useFonts } from "expo-font";
import { getNotification } from "./src/api/notificationApi";


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
      <Stack.Screen name="ScholarDetail" component={ScholarshipDetail} options={{ headerShown: false, tabBarStyle: { display: 'none' } }} />
      <Stack.Screen name="MultiStep" component={MultiStepForm} options={{ headerShown: false }} />
      <Stack.Screen name="UserListScreen" component={UserList} options={{ headerShown: false }} />
      <Stack.Screen name="ChatScreen" component={Chat} options={{ headerShown: true }} />
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

function ServiceStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ServiceListScreen" component={ServiceList} />
      <Stack.Screen name="ServiceDetailScreen" component={ServiceDetail} />
      <Stack.Screen name="ServiceForm" component={ServiceForm} />
    </Stack.Navigator>
  )
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
    </Stack.Navigator>
  )
}

function MainTabs() {

  const [unreadCount, setUnreadCount] = useState(0);
  const { userInfo } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotification(userInfo.id);
        const unreadNotifications = response?.data?.filter(notification => !notification.isRead) || [];
        setUnreadCount(unreadNotifications.length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <Entypo name="home" size={22} color={focused ? COLORS.primary : COLORS.gray30} />
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: focused ? COLORS.primary : COLORS.gray30, fontSize: 12 }}>Home</Text>
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <Entypo name="magnifying-glass" size={22} color={focused ? COLORS.primary : COLORS.gray30} />
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: focused ? COLORS.primary : COLORS.gray30, fontSize: 12 }}>Search</Text>
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ServiceStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <Entypo name="chat" size={22} color={focused ? COLORS.primary : COLORS.gray30} />
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: focused ? COLORS.primary : COLORS.gray30, fontSize: 12 }}>Services</Text>
          ),
          headerShown: false,
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
                  position: 'absolute',
                  right: -5,
                  top: -3,
                  backgroundColor: 'red',
                  borderRadius: 8,
                  width: 16,
                  height: 16,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                    {unreadCount}
                  </Text>
                </View>
              )}
            </View>
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: focused ? COLORS.primary : COLORS.gray30, fontSize: 12 }}>Notifications</Text>
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <FontAwesome6 name="user-large" size={22} color={focused ? COLORS.primary : COLORS.gray30} />
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: focused ? COLORS.primary : COLORS.gray30, fontSize: 12 }}>Me</Text>
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
