// import React, { useEffect, useState } from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createSharedElementStackNavigator } from "react-navigation-shared-element";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { Entypo, FontAwesome6 } from "@expo/vector-icons";
// import { AuthProvider, useAuth } from "./src/context/AuthContext";
// import { Easing, Text, View } from "react-native";

// import WelcomeScreen from "./src/screens/Authentication/WelcomeScreen";
// import LoginScreen from "./src/screens/Authentication/LoginScreen";
// import RegisterScreen from "./src/screens/Authentication/RegisterScreen";
// import ProfileScreen from "./src/screens/Profile/ProfileScreen";
// import HomeScreen from "./src/screens/HomeScreen";
// import SearchScreen from "./src/screens/SearchScreen";
// import ScholarshipListing from "./src/screens/Scholarship/ScholarshipListing";
// import ScholarshipDetail from "./src/screens/Scholarship/ScholarshipDetail";
// import UserList from "./src/components/Chat/UserList";
// import Chat from "./src/components/Chat/Chat";
// import MultiStepForm from "./src/screens/Applicant/MultiStepForm";
// import NotificationScreen from "./src/screens/Profile/NotificationScreen";
// import ServiceList from "./src/screens/Service/ServiceList";
// import ServiceDetail from "./src/screens/Service/ServiceDetail";
// import ServiceForm from "./src/components/Service/ServiceForm";
// import PaymentScreen from "./src/screens/Payment/PaymentScreen"
// import HistoryScreen from "./src/screens/Profile/HistoryScreen";
// import EditProfileScreen from "./src/screens/Profile/EditProfileScreen";
// import ChangePasswordScreen from "./src/screens/Profile/ChangePasswordScreen";
// import ApplicationManagementScreen from "./src/screens/Expert/ApplicationManagementScreen";
// import ApplicationDetailScreen from "./src/screens/Expert/ApplicationDetailScreen";

// import { COLORS } from "./src/constants";
// import { useFonts } from "expo-font";
// import { getNotification } from "./src/api/notificationApi";
// import { subscribeToNotifications } from "./src/services/NotificationService"

// const Tab = createBottomTabNavigator();
// const Stack = createSharedElementStackNavigator();

// const options = {
//   headerShown: false,
//   gestureEnabled: false,
//   transitionSpec: {
//     open: {
//       animation: 'timing',
//       config: { duration: 300, easing: Easing.inOut(Easing.ease) }
//     },
//     close: {
//       animation: 'timing',
//       config: { duration: 300, easing: Easing.inOut(Easing.ease) }
//     },
//     cardStyleInterpolator: ({ current: { progress } }) => {
//       return {
//         cardStyle: {
//           opacity: progress
//         }
//       }
//     }
//   }
// }

// function AuthStack() {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="Welcome" component={WelcomeScreen} />
//       <Stack.Screen name="Login" component={LoginScreen} />
//       <Stack.Screen name="Register" component={RegisterScreen} />
//     </Stack.Navigator>
//   );
// }

// function ExpertStack() {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="ExpertTabs" component={ExpertTabs} />
//       <Stack.Screen name="ApplicationManagementScreen" component={ApplicationManagementScreen} />
//       <Stack.Screen name="ApplicationDetailScreen" component={ApplicationDetailScreen} />
//     </Stack.Navigator>
//   )
// }

// function HomeTabs() {
//   const [unreadCount, setUnreadCount] = useState(0);
//   const { userInfo } = useAuth();

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const response = await getNotification(userInfo.id);
//         const unreadNotifications = response?.data?.filter(notification => !notification.isRead) || [];
//         setUnreadCount(unreadNotifications.length);
//       } catch (error) {
//         console.error("Error fetching notifications:", error);
//       }
//     };

//     if (userInfo?.id) {
//       fetchNotifications();
//     }
//   }, [userInfo]);

//   // useEffect(() => {
//   //   if (userInfo?.id) {
//   //     const unsubscribe = subscribeToNotifications(userInfo.id, (unreadNotifications) => {
//   //       setUnreadCount(unreadNotifications.length);
//   //     });
//   //     return () => unsubscribe();
//   //   }
//   // }, [userInfo]);

//   return (
//     <Tab.Navigator screenOptions={{ headerShown: false }}>
//       <Tab.Screen
//         name="HomeTab"
//         component={HomeScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <Entypo name="home" size={22} color={focused ? COLORS.primary : COLORS.gray30} />
//           ),
//           tabBarLabel: ({ focused }) => (
//             <Text style={{ color: focused ? COLORS.primary : COLORS.gray30, fontSize: 12 }}>Home</Text>
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Search"
//         component={SearchScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <Entypo name="magnifying-glass" size={22} color={focused ? COLORS.primary : COLORS.gray30} />
//           ),
//           tabBarLabel: ({ focused }) => (
//             <Text style={{ color: focused ? COLORS.primary : COLORS.gray30, fontSize: 12 }}>Search</Text>
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Expert"
//         component={ServiceList}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <Entypo name="chat" size={22} color={focused ? COLORS.primary : COLORS.gray30} />
//           ),
//           tabBarLabel: ({ focused }) => (
//             <Text style={{ color: focused ? COLORS.primary : COLORS.gray30, fontSize: 12 }}>Services</Text>
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Notifications"
//         component={NotificationScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <View>
//               <FontAwesome6 name="bell" size={22} color={focused ? COLORS.primary : COLORS.gray30} />
//               {unreadCount > 0 && (
//                 <View style={{
//                   position: 'absolute',
//                   right: -5,
//                   top: -3,
//                   backgroundColor: 'red',
//                   borderRadius: 8,
//                   width: 16,
//                   height: 16,
//                   justifyContent: 'center',
//                   alignItems: 'center'
//                 }}>
//                   <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
//                     {unreadCount}
//                   </Text>
//                 </View>
//               )}
//             </View>
//           ),
//           tabBarLabel: ({ focused }) => (
//             <Text style={{ color: focused ? COLORS.primary : COLORS.gray30, fontSize: 12 }}>Notifications</Text>
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Profile"
//         component={ProfileScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <FontAwesome6 name="user-large" size={22} color={focused ? COLORS.primary : COLORS.gray30} />
//           ),
//           tabBarLabel: ({ focused }) => (
//             <Text style={{ color: focused ? COLORS.primary : COLORS.gray30, fontSize: 12 }}>Me</Text>
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// }

// function ExpertTabs() {
//   const [unreadCount, setUnreadCount] = useState(0);
//   const { userInfo } = useAuth();

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const response = await getNotification(userInfo.id);
//         const unreadNotifications = response?.data?.filter(notification => !notification.isRead) || [];
//         setUnreadCount(unreadNotifications.length);
//       } catch (error) {
//         console.error("Error fetching notifications:", error);
//       }
//     };

//     if (userInfo?.id) {
//       fetchNotifications();
//     }
//   }, [userInfo]);

//   // useEffect(() => {
//   //   if (userInfo?.id) {
//   //     const unsubscribe = subscribeToNotifications(userInfo.id, (unreadNotifications) => {
//   //       setUnreadCount(unreadNotifications.length);
//   //     });
//   //     return () => unsubscribe();
//   //   }
//   // }, [userInfo]);

//   return (
//     <Tab.Navigator screenOptions={{ headerShown: false }}>
//       <Tab.Screen
//         name="Applications"
//         component={ApplicationManagementScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <Entypo name="chat" size={22} color={focused ? COLORS.primary : COLORS.gray30} />
//           ),
//           tabBarLabel: ({ focused }) => (
//             <Text style={{ color: focused ? COLORS.primary : COLORS.gray30, fontSize: 12 }}>Services</Text>
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Notifications"
//         component={NotificationScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <View>
//               <FontAwesome6 name="bell" size={22} color={focused ? COLORS.primary : COLORS.gray30} />
//               {unreadCount > 0 && (
//                 <View style={{
//                   position: 'absolute',
//                   right: -5,
//                   top: -3,
//                   backgroundColor: 'red',
//                   borderRadius: 8,
//                   width: 16,
//                   height: 16,
//                   justifyContent: 'center',
//                   alignItems: 'center'
//                 }}>
//                   <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
//                     {unreadCount}
//                   </Text>
//                 </View>
//               )}
//             </View>
//           ),
//           tabBarLabel: ({ focused }) => (
//             <Text style={{ color: focused ? COLORS.primary : COLORS.gray30, fontSize: 12 }}>Notifications</Text>
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Profile"
//         component={ProfileScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <FontAwesome6 name="user-large" size={22} color={focused ? COLORS.primary : COLORS.gray30} />
//           ),
//           tabBarLabel: ({ focused }) => (
//             <Text style={{ color: focused ? COLORS.primary : COLORS.gray30, fontSize: 12 }}>Me</Text>
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// }

// function MainTabs() {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="Home" component={HomeTabs} />
//       <Stack.Screen name="MultiStep" component={MultiStepForm} />
//       <Stack.Screen name="UserListScreen" component={UserList} />
//       <Stack.Screen name="ChatScreen" component={Chat} />
//       <Stack.Screen name="ScholarshipListing" component={ScholarshipListing} options={() => options} />
//       <Stack.Screen name="ScholarDetail" component={ScholarshipDetail} />
//       <Stack.Screen name="ServiceDetailScreen" component={ServiceDetail} />
//       <Stack.Screen name="ServiceForm" component={ServiceForm} />
//       <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
//       <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
//       <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
//       <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
//     </Stack.Navigator>
//   )
// }

// function AppContent() {
//   const { userInfo, isLoggedIn } = useAuth();
//   return (
//     <>
//       <NavigationContainer>
//         {isLoggedIn ? (
//           userInfo.role === "Funder" ? <ExpertStack /> : <MainTabs />
//         ) : (
//           <AuthStack />
//         )}
//       </NavigationContainer>
//     </>
//   );
// }

// export default function App() {
//   const [fontsLoaded] = useFonts({
//     'Roboto-Black': require('./src/assets/fonts/Roboto-Black.ttf'),
//     'Roboto-Bold': require('./src/assets/fonts/Roboto-Bold.ttf'),
//     'Roboto-Regular': require('./src/assets/fonts/Roboto-Regular.ttf'),
//   });

//   if (!fontsLoaded) {
//     return undefined;
//   }

//   return (
//     <>
//       <AuthProvider>
//         <AppContent />
//       </AuthProvider>
//     </>
//   );
// }

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { useFonts } from "expo-font";
import { AuthStack } from "./src/router/AuthStack";
import { MainStack } from "./src/router/MainStack";
import { ExpertStack } from "./src/router/ExpertStack";

function AppContent() {
  const { userInfo, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <AuthStack />;
  }

  const StackComponent = userInfo.role === "Funder" ? ExpertStack : MainStack;
  return <StackComponent />;
}

export default function App() {
  const [fontsLoaded] = useFonts({
    'Roboto-Black': require('./src/assets/fonts/Roboto-Black.ttf'),
    'Roboto-Bold': require('./src/assets/fonts/Roboto-Bold.ttf'),
    'Roboto-Regular': require('./src/assets/fonts/Roboto-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </AuthProvider>
  );
}
