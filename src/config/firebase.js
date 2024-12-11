import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth, db, firebaseApp };

// import { initializeApp } from 'firebase/app';
// import messaging from 'firebase/messaging';

// const firebaseConfig = {
//   apiKey: process.env.API_KEY,
//   authDomain: process.env.AUTH_DOMAIN,
//   projectId: process.env.PROJECT_ID,
//   storageBucket: process.env.STORAGE_BUCKET,
//   messagingSenderId: process.env.MESSAGING_SENDER_ID,
//   appId: process.env.APP_ID,
// };

// const firebaseApp = initializeApp(firebaseConfig);

// export const requestUserPermission = async () => {
//   try {
//     const authStatus = await messaging().requestPermission();
//     const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//     if (enabled) {
//       console.log('Notification permission granted.');
//     } else {
//       console.log('Notification permission denied.');
//     }
//   } catch (error) {
//     console.error('Error requesting notification permission:', error);
//   }
// };

// // Get FCM device token
// export const getDeviceToken = async () => {
//   try {
//     const token = await messaging().getToken();
//     if (token) {
//       console.log('FCM Device Token:', token);
//       return token;
//     }
//   } catch (error) {
//     console.error('Error getting device token:', error);
//   }
// };

// // Listen for foreground messages
// export const onMessageListener = (callback) => {
//   return messaging().onMessage(async (payload) => {
//     console.log('Foreground message received:', payload);
//     callback(payload);
//   });
// };
