import React from "react";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import { HomeTabs } from "./Tabs";
import MultiStepForm from "../screens/Applicant/MultiStepForm";
import UserList from "../components/Chat/UserList";
import Chat from "../components/Chat/Chat";
import ScholarshipByMajor from "../screens/Scholarship/ScholarshipByMajor";
import ScholarshipDetail from "../screens/Scholarship/ScholarshipDetail";
import ServiceDetail from "../screens/Service/ServiceDetail";
import ServiceForm from "../components/Service/ServiceForm";
import ProviderProfileScreen from "../screens/Provider/ProviderProfileScreen";
import ApplicationHistoryScreen from "../screens/Profile/ApplicationHistoryScreen";
import ServiceHistoryScreen from "../screens/Profile/ServiceHistoryScreen";
import EditProfileScreen from "../screens/Profile/EditProfileScreen";
import ChangePasswordScreen from "../screens/Profile/ChangePasswordScreen";
import PaymentSuccessScreen from "../screens/Payment/PaymentSuccessScreen";
import PaymentFailScreen from "../screens/Payment/PaymentFailScreen";
import WalletScreen from "../screens/Profile/WalletScreen";
import ScholarshipList from "../screens/Scholarship/ScholarshipList";
import BankScreen from "../screens/Profile/BankScreen";

const Stack = createSharedElementStackNavigator();

export function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeTabs} />

      <Stack.Screen name="UserListScreen" component={UserList} />
      <Stack.Screen name="ChatScreen" component={Chat} options={{ headerShown: true }} />

      <Stack.Screen name="ScholarshipList" component={ScholarshipList} />
      <Stack.Screen name="ScholarshipByMajor" component={ScholarshipByMajor} />
      <Stack.Screen name="ScholarshipDetail" component={ScholarshipDetail} />
      <Stack.Screen name="MultiStep" component={MultiStepForm} />

      <Stack.Screen name="ServiceDetailScreen" component={ServiceDetail} />
      <Stack.Screen name="ServiceForm" component={ServiceForm} />
      <Stack.Screen name="ProviderProfileScreen" component={ProviderProfileScreen} />

      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
      <Stack.Screen name="ApplicationHistoryScreen" component={ApplicationHistoryScreen} />
      <Stack.Screen name="ServiceHistoryScreen" component={ServiceHistoryScreen} />
      <Stack.Screen name="WalletScreen" component={WalletScreen} />
      <Stack.Screen name="BankScreen" component={BankScreen} />

      <Stack.Screen name="PaymentSuccessScreen" component={PaymentSuccessScreen} />
      <Stack.Screen name="PaymentFailScreen" component={PaymentFailScreen} />
    </Stack.Navigator>
  );
}
