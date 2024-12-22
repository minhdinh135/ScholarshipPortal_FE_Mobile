import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { useFonts } from "expo-font";
import { AuthStack } from "./src/router/AuthStack";
import { MainStack } from "./src/router/MainStack";
import { ExpertStack } from "./src/router/ExpertStack";
import { StatusBar } from "react-native";

function AppContent() {
  const { userInfo, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <AuthStack />;
  }

  const StackComponent = userInfo.role === "Expert" ? ExpertStack : MainStack;
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
        <StatusBar hidden={true} />
        <AppContent />
      </NavigationContainer>
    </AuthProvider>
  );
}
