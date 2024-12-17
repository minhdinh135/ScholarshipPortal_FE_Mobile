import React from "react";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import WelcomeScreen from "../screens/Authentication/WelcomeScreen";
import LoginScreen from "../screens/Authentication/LoginScreen";
import RegisterScreen from "../screens/Authentication/RegisterScreen";
import { ForgotPasswordScreen, OTPScreen, ResetPasswordScreen } from "../screens/Authentication/ForgotPasswordScreen";

const Stack = createSharedElementStackNavigator();

export function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="OTPScreen" component={OTPScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}
