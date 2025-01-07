import React from "react";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import { HomeTabs } from "./Tabs";
import MultiStepForm from "../screens/Applicant/MultiStepForm";
import ScholarshipByMajor from "../screens/Scholarship/ScholarshipByMajor";
import ScholarshipDetail from "../screens/Scholarship/ScholarshipDetail";
import ServiceDetail from "../screens/Service/ServiceDetail";
import ProviderProfileScreen from "../screens/Provider/ProviderProfileScreen";
import ApplicationHistoryScreen from "../screens/Profile/ApplicationHistoryScreen";
import ApplicationDetailScreen from "../screens/Expert/ApplicationDetailScreen";
import ServiceHistoryScreen from "../screens/Profile/ServiceHistoryScreen";
import EditProfileScreen from "../screens/Profile/EditProfileScreen";
import ChangePasswordScreen from "../screens/Profile/ChangePasswordScreen";
import PaymentSuccessScreen from "../screens/Payment/PaymentSuccessScreen";
import PaymentFailScreen from "../screens/Payment/PaymentFailScreen";
import WalletScreen from "../screens/Profile/WalletScreen";
import ScholarshipList from "../screens/Scholarship/ScholarshipList";
import BankScreen from "../screens/Profile/BankScreen";
import ChatBoxScreen from "../screens/Chat/ChatBoxScreen";
import ChatScreen from "../screens/Chat/ChatScreen";
import UserGuideScreen from "../screens/Support/UserGuideScreen";
import AboutUsScreen from "../screens/Support/AboutUsScreen";
import ProfileSkillScreen from "../screens/Profile/ProfileSkillScreen";
import UpdateInformationScreen from "../screens/Profile/UpdateInformationScreen";

const Stack = createSharedElementStackNavigator();

export function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        transitionSpec: {
          open: {
            animation: 'timing',
            config: { duration: 200 },
          },
          close: {
            animation: 'timing',
            config: { duration: 200 },
          },
        },
        cardStyleInterpolator: ({ current, next, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
                {
                  translateX: next
                    ? next.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -100],
                    })
                    : 0,
                },
              ],
            },
          };
        },
      }}
    >
      <Stack.Screen name="Home" component={HomeTabs} />

      <Stack.Screen name="ChatBoxScreen" component={ChatBoxScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />

      <Stack.Screen name="ScholarshipList" component={ScholarshipList} />
      <Stack.Screen name="ScholarshipByMajor" component={ScholarshipByMajor} />
      <Stack.Screen name="ScholarshipDetail" component={ScholarshipDetail} />
      <Stack.Screen name="MultiStep" component={MultiStepForm} />

      <Stack.Screen name="ServiceDetailScreen" component={ServiceDetail} />
      <Stack.Screen name="ProviderProfileScreen" component={ProviderProfileScreen} />

      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen name="ProfileSkillScreen" component={ProfileSkillScreen} />
      <Stack.Screen name="UpdateInformationScreen" component={UpdateInformationScreen} />
      <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />

      <Stack.Screen name="ApplicationHistoryScreen" component={ApplicationHistoryScreen} />
      <Stack.Screen name="ApplicationDetailScreen" component={ApplicationDetailScreen} />
      <Stack.Screen name="ServiceHistoryScreen" component={ServiceHistoryScreen} />

      <Stack.Screen name="WalletScreen" component={WalletScreen} />
      <Stack.Screen name="BankScreen" component={BankScreen} />

      <Stack.Screen name="PaymentSuccessScreen" component={PaymentSuccessScreen} />
      <Stack.Screen name="PaymentFailScreen" component={PaymentFailScreen} />

      <Stack.Screen name="UserGuideScreen" component={UserGuideScreen} />
      <Stack.Screen name="AboutUsScreen" component={AboutUsScreen} />
    </Stack.Navigator>
  );
}
