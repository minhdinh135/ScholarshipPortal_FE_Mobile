import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
// http://10.0.2.2:5254/api/authentication/login
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        setUserToken(token);
        const decodedUserInfo = jwtDecode(token);
        setUserInfo(decodedUserInfo);
        await AsyncStorage.setItem('userToken', token);
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
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userInfo');
  };

  const autoSignIn = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      setUserToken(token);
      const decodedUserInfo = jwtDecode(token);
      setUserInfo(decodedUserInfo);
    }
  };

  return (
    <AuthContext.Provider value={{ userToken, userInfo, signIn, signOut, autoSignIn, isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
