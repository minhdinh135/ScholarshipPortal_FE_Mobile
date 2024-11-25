import React from "react";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import { HomeTabs } from "./Tabs";
import MultiStepForm from "../screens/Applicant/MultiStepForm";
import UserList from "../components/Chat/UserList";
import Chat from "../components/Chat/Chat";
import ScholarshipListing from "../screens/Scholarship/ScholarshipListing";
import ScholarshipDetail from "../screens/Scholarship/ScholarshipDetail";
import ServiceDetail from "../screens/Service/ServiceDetail";
import ServiceForm from "../components/Service/ServiceForm";
import PaymentScreen from "../screens/Payment/PaymentScreen";
import HistoryScreen from "../screens/Profile/HistoryScreen";
import EditProfileScreen from "../screens/Profile/EditProfileScreen";
import ChangePasswordScreen from "../screens/Profile/ChangePasswordScreen";

const Stack = createSharedElementStackNavigator();

export function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeTabs} />
      <Stack.Screen name="MultiStep" component={MultiStepForm} />
      <Stack.Screen name="UserListScreen" component={UserList} />
      <Stack.Screen name="ChatScreen" component={Chat} options={{ headerShown: true }} />
      <Stack.Screen name="ScholarshipListing" component={ScholarshipListing} />
      <Stack.Screen name="ScholarshipDetail" component={ScholarshipDetail} />
      <Stack.Screen name="ServiceDetailScreen" component={ServiceDetail} />
      <Stack.Screen name="ServiceForm" component={ServiceForm} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
      <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
    </Stack.Navigator>
  );
}
