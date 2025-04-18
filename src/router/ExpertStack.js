import React from "react";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import ApplicationManagementScreen from "../screens/Expert/ApplicationManagementScreen";
import ApplicationDetailScreen from "../screens/Expert/ApplicationDetailScreen";
import { ExpertTabs } from "./Tabs";
import EditProfileScreen from "../screens/Profile/EditProfileScreen";
import ChangePasswordScreen from "../screens/Profile/ChangePasswordScreen";
import WalletScreen from "../screens/Profile/WalletScreen";
import ScholarshipListScreen from "../screens/Expert/ScholarshipListScreen";
import ScholarshipDetail from "../screens/Scholarship/ScholarshipDetail";
import AboutUsScreen from "../screens/Support/AboutUsScreen";

const Stack = createSharedElementStackNavigator();

export function ExpertStack() {
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
      <Stack.Screen name="ExpertTabs" component={ExpertTabs} />
      <Stack.Screen name="ScholarshipListScreen" component={ScholarshipListScreen} />
      <Stack.Screen name="ScholarshipDetail" component={ScholarshipDetail} />

      <Stack.Screen name="ApplicationManagementScreen" component={ApplicationManagementScreen} />
      <Stack.Screen name="ApplicationDetailScreen" component={ApplicationDetailScreen} />

      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
      <Stack.Screen name="WalletScreen" component={WalletScreen} />
      <Stack.Screen name="AboutUsScreen" component={AboutUsScreen} />

    </Stack.Navigator>
  );
}
