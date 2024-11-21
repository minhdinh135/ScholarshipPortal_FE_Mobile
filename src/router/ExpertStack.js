import React from "react";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import ApplicationManagementScreen from "../screens/Expert/ApplicationManagementScreen";
import ApplicationDetailScreen from "../screens/Expert/ApplicationDetailScreen";
import { ExpertTabs } from "./Tabs";

const Stack = createSharedElementStackNavigator();

export function ExpertStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExpertTabs" component={ExpertTabs} />
      <Stack.Screen name="ApplicationManagementScreen" component={ApplicationManagementScreen} />
      <Stack.Screen name="ApplicationDetailScreen" component={ApplicationDetailScreen} />
    </Stack.Navigator>
  );
}
