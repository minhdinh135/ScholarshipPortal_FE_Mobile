import React, { createContext, useContext, useState, useEffect } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import { signUp as apiSignUp, signIn as apiSignIn } from "../api/authenticationApi";

import { jwtDecode } from "jwt-decode";
import { decode } from "base-64";
global.atob = decode;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          const decodedUserInfo = jwtDecode(token);
          setUserToken(token);
          setUserInfo(decodedUserInfo);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.log("Failed to load token from storage:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
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
      }
    } catch (error) {
      Alert.alert("Sign in failed", error.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const response = await fetch(`${process.env.BASE_URL}/api/authentication/auth-google`);
      const data = await response.json();
      const authUrl = data.url;
      const result = await WebBrowser.openAuthSessionAsync(authUrl);

      if (result.type === "success" && result.url) {
        const redirectUrl = result.url;
        const urlParams = new URLSearchParams(redirectUrl.split('?')[1]);
        const code = urlParams.get("code");

        if (code) {
          const tokenResponse = await fetch(`${process.env.BASE_URL}/api/authentication/google/callback?code=${code}`);

          if (tokenResponse.ok) {
            const tokenData = await tokenResponse.json();
            const token = tokenData.token;

            if (token) {
              setUserToken(token);
              const decodedUserInfo = jwtDecode(token);
              setUserInfo(decodedUserInfo);
              setIsLoggedIn(true);
              await AsyncStorage.setItem("userToken", token);
              Alert.alert("Login successful");
            } else {
              Alert.alert("Error: Token missing");
            }
          } else {
            Alert.alert("Error in Google login callback");
          }
        } else {
          Alert.alert("Error: No code received in URL");
        }
      }
    } catch (error) {
      console.log("Google login error:", error);
      Alert.alert("Google login failed", error.message);
    }
  };

  const signOut = async () => {
    setUserToken(null);
    setUserInfo(null);
    setIsLoggedIn(false);
    await AsyncStorage.removeItem("userToken");
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
