// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import Constants from "expo-constants";
// import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// const firebaseConfig = {
//   apiKey: Constants.manifest2.extra.API_KEY,
//   authDomain: Constants.manifest2.extra.AUTH_DOMAIN,
//   projectId: Constants.manifest2.extra.PROJECT_ID,
//   storageBucket: Constants.manifest2.extra.STORAGE_BUCKET,
//   messagingSenderId: Constants.manifest2.extra.MESSAGING_SENDER_ID,
//   appId: Constants.manifest2.extra.APP_ID
// };

// const app = initializeApp(firebaseConfig);

// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
// });

// const database = getFirestore(app);

// export { auth, database }

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCUk3mrCBza2cPWqlRM1eGR6VRLd6VX-9s",
  authDomain: "scholarapp-51bef.firebaseapp.com",
  projectId: "scholarapp-51bef",
  storageBucket: "scholarapp-51bef.appspot.com",
  messagingSenderId: "69297679180",
  appId: "1:69297679180:web:aa0f86ca15fe514135fde9",
  // apiKey: process.env.API_KEY,
  // authDomain: process.env.AUTH_DOMAIN,
  // projectId: process.env.PROJECT_ID,
  // storageBucket: process.env.STORAGE_BUCKET,
  // messagingSenderId: process.env.MESSAGING_SENDER_ID,
  // appId: process.env.APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth, db, firebaseApp };
