import React, { createContext, useContext, useState, useEffect } from 'react';
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { decode } from 'base-64';
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
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          const decodedUserInfo = jwtDecode(token);
          setUserToken(token);
          setUserInfo(decodedUserInfo);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Failed to load token from storage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const signUp = async (user) => {
    try {
      const response = await fetch('http://10.0.2.2:5254/api/authentication/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token;
        if (!token) {
          throw new Error('No token received from server.');
        }

        // Store the token
        setUserToken(token);
        const decodedUserInfo = jwtDecode(token);
        setUserInfo(decodedUserInfo);
        setIsLoggedIn(true);
        await AsyncStorage.setItem('userToken', token);

      } else {
        console.error('Sign up error:', data);
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Sign up error:', error);
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await fetch('http://10.0.2.2:5254/api/authentication/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token;
        if (!token) {
          throw new Error('No token received from server.');
        }
        setUserToken(token);
        const decodedUserInfo = jwtDecode(token);
        setUserInfo(decodedUserInfo);
        setIsLoggedIn(true);
        await AsyncStorage.setItem('userToken', token);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const response = await fetch('http://10.0.2.2:5254/api/authentication/auth-google');
      const data = await response.json();
      const authUrl = data.url;

      // Start the Google OAuth session
      const result = await WebBrowser.openAuthSessionAsync(authUrl, 'myapp://redirect');

      if (result.type === 'success' && result.url) {
        const redirectUrl = result.url;
        const code = new URL(redirectUrl).searchParams.get("code");

        if (code) {
          // Retrieve token using the authorization code
          const tokenResponse = await fetch(`http://10.0.2.2:5254/api/authentication/google/callback?code=${code}`);

          if (tokenResponse.ok) {
            const tokenData = await tokenResponse.json();
            const token = tokenData.token;
            if (token) {
              setUserToken(token);
              const decodedUserInfo = jwtDecode(token);
              setUserInfo(decodedUserInfo);
              setIsLoggedIn(true);
              await AsyncStorage.setItem('userToken', token);
              Alert.alert('Login successful');
            }
          } else {
            Alert.alert('Error in Google login callback');
          }
        }
      }
    } catch (error) {
      console.error("Google login error:", error);
      Alert.alert("Google login failed");
    }
  };

  const signOut = async () => {
    setUserToken(null);
    setUserInfo(null);
    setIsLoggedIn(false);
    await AsyncStorage.removeItem('userToken');
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ userToken, userInfo, signIn, signInWithGoogle, signUp, signOut, isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
