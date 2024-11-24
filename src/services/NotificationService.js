// src/api/notificationService.js
import { db } from '../config/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

// Real-time listener for unread notifications
export const subscribeToNotifications = (userId, callback) => {
  const notificationsRef = collection(db, 'notifications');

  // Query for unread notifications for the specific user
  const q = query(
    notificationsRef,
    where('userId', '==', userId),
    where('isRead', '==', false)
  );

  // Listen for real-time updates
  return onSnapshot(q, (snapshot) => {
    const unreadNotifications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(unreadNotifications);
  });
};

// import messaging from '@react-native-firebase/messaging';

// const getToken = async () => {
//   const token = await messaging().getToken();
//   console.log('FCM Token:', token);
//   // Send this token to your backend
// };

// useEffect(() => {
//   getToken();
// }, []);

// useEffect(() => {
//   const unsubscribe = messaging().onMessage(async remoteMessage => {
//     console.log('A new FCM message arrived!', remoteMessage);
//   });

//   return unsubscribe; // Clean up the listener
// }, []);
