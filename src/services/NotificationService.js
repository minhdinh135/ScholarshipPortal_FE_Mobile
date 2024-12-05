import { db } from '../config/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

export const subscribeToNotifications = (userId, callback) => {
  const notificationsRef = collection(db, 'notifications');
  const q = query(
    notificationsRef,
    where('userId', '==', userId),
    where('isRead', '==', false)
  );

  return onSnapshot(q, (snapshot) => {
    const unreadNotifications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(unreadNotifications);
  });
};