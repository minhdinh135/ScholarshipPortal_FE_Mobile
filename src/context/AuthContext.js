import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode'
import { decode } from 'base-64';
global.atob = decode;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // To manage loading state

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Get the token from AsyncStorage when the app loads
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
        await AsyncStorage.setItem('userToken', token); // Store the token in AsyncStorage
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const signOut = async () => {
    setUserToken(null);
    setUserInfo(null);
    setIsLoggedIn(false);
    await AsyncStorage.removeItem('userToken');
  };

  if (loading) {
    return null; // Show a loading spinner or some placeholder while checking storage
  }

  return (
    <AuthContext.Provider value={{ userToken, userInfo, signIn, signOut, isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
