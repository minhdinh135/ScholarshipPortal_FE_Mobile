import React, { createContext, useContext, useState, useEffect } from "react";
import { ActivityIndicator, Alert, View, Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signUp as apiSignUp, signIn as apiSignIn } from "../api/authenticationApi";

import { jwtDecode } from "jwt-decode";
import { decode } from "base-64";
import { requestNotify } from "../config/requestNotify";
import messaging from '@react-native-firebase/messaging';
global.atob = decode;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fcmToken, setFcmToken] = useState(null);

  const requestNotification = async (decodedUserInfo) => {
    const fcm = await AsyncStorage.getItem("fcmToken");
    if (!fcm) {
      const token = await requestNotify(decodedUserInfo.id);
      if (token != null) {
        setFcmToken(token);
        await AsyncStorage.setItem("fcmToken", token);
      }
    }
  }

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          const decodedUserInfo = jwtDecode(token);
          setUserToken(token);
          setUserInfo(decodedUserInfo);
          setIsLoggedIn(true);
          await requestNotification(decodedUserInfo);
        }
      } catch (error) {
        console.log("Failed to load token from storage:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    const handleDeepLink = async (event) => {
      try {
        const { url } = event;
        if (url.startsWith("com.scholarship://login-google")) {
          const responseParams = new URLSearchParams(url.split("?")[1]);
          const jwt = responseParams.get("jwt");
          if (jwt) {
            const decodedUserInfo = jwtDecode(jwt);
            setUserToken(jwt);
            setUserInfo(decodedUserInfo);
            setIsLoggedIn(true);
            await requestNotification(decodedUserInfo);
            await AsyncStorage.setItem("userToken", jwt);
          }
        }
      } catch (error) {
        console.error("Error handling deep link:", error);
        Alert.alert("Login failed", "Could not process deep link");
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, []);

  const signUp = async (user) => {
    try {
      const data = await apiSignUp(user);
      const token = data.token;

      if (token) {
        setUserToken(token);
        const decodedUserInfo = jwtDecode(token);
        setUserInfo(decodedUserInfo);
        setIsLoggedIn(true);
        await AsyncStorage.setItem("userToken", token);
        await requestNotification(decodedUserInfo);
      }
    } catch (error) {
      Alert.alert("Sign up failed", error.message);
    }
  };

  const signIn = async (email, password) => {
    try {
      const data = await apiSignIn(email, password);
      const token = data.token;

      if (token) {
        const decodedUserInfo = jwtDecode(token);
        if (decodedUserInfo.role !== "Expert" && decodedUserInfo.role !== "Applicant") {
          Alert.alert("Login failed", "User not found.");
          return;
        }
        setUserToken(token);
        setUserInfo(decodedUserInfo);
        setIsLoggedIn(true);
        await AsyncStorage.setItem("userToken", token);
        await requestNotification(decodedUserInfo);
      }
    } catch (error) {
      Alert.alert("Sign in failed", error.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const response = await fetch(`${process.env.BASE_URL}/api/authentication/auth-google-mobile`);
      const data = await response.json();
      const authUrl = data.url;
      Linking.openURL(authUrl);
    } catch (error) {
      Alert.alert("Google sign-in failed", error.message);
    }
  };

  const signOut = async () => {
    setUserToken(null);
    setUserInfo(null);
    setIsLoggedIn(false);
    setFcmToken(null);
    await messaging().deleteToken();
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("fcmToken");
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        userToken,
        userInfo,
        signIn,
        signInWithGoogle,
        signUp,
        signOut,
        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
