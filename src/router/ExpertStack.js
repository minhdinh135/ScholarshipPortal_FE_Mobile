import React from "react";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import ApplicationManagementScreen from "../screens/Expert/ApplicationManagementScreen";
import ApplicationDetailScreen from "../screens/Expert/ApplicationDetailScreen";
import SecondReviewScreen from "../screens/Expert/SecondReviewScreen";
import { ExpertTabs } from "./Tabs";
import EditProfileScreen from "../screens/Profile/EditProfileScreen";
import ChangePasswordScreen from "../screens/Profile/ChangePasswordScreen";
import WalletScreen from "../screens/Profile/WalletScreen";
import ScholarshipListScreen from "../screens/Expert/ScholarshipListScreen";
import ScholarshipDetail from "../screens/Scholarship/ScholarshipDetail";

const Stack = createSharedElementStackNavigator();

export function ExpertStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExpertTabs" component={ExpertTabs} />
      <Stack.Screen name="ScholarshipListScreen" component={ScholarshipListScreen} />
      <Stack.Screen name="ScholarshipDetail" component={ScholarshipDetail} />

      <Stack.Screen name="ApplicationManagementScreen" component={ApplicationManagementScreen} />
      <Stack.Screen name="ApplicationDetailScreen" component={ApplicationDetailScreen} />
      <Stack.Screen name="SecondReviewScreen" component={SecondReviewScreen} />

      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
      <Stack.Screen name="WalletScreen" component={WalletScreen} />

    </Stack.Navigator>
  );
}
