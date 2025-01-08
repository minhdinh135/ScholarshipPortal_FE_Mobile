import { useState, useEffect } from "react";
import { getNotification } from "../api/notificationApi";
import messaging from '@react-native-firebase/messaging';

const useUnreadNotifications = (userId) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotification(userId);
        const unreadNotifications = response?.data?.filter(notification => !notification.isRead) || [];
        setUnreadCount(unreadNotifications.length);
      } catch (error) {
        console.log("Error fetching notifications:", error);
      }
    };

    if (userId) {
      fetchNotifications();
    }

    const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
      const { notification, data } = remoteMessage;

      if (notification && data?.topic == userId) {
        await fetchNotifications();
      }
    });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      const { notification, data } = remoteMessage;
      if (notification && data?.topic == userId) {
        await fetchNotifications();
      }
    });
    return () => {
      unsubscribeForeground();
    };
  }, [userId]);

  return unreadCount;
};

export default useUnreadNotifications;
