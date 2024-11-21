import { useState, useEffect } from "react";
import { getNotification } from "../api/notificationApi";

const useUnreadNotifications = (userId) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotification(userId);
        const unreadNotifications = response?.data?.filter(notification => !notification.isRead) || [];
        setUnreadCount(unreadNotifications.length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  return unreadCount;
};

export default useUnreadNotifications;
