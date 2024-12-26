import { subscribeToTopic } from '../api/notificationApi';
import messaging from '@react-native-firebase/messaging';

export const requestNotify = async (id) => {
  try {
    // Request permissions for notifications
    //const permission = await Notifications.requestPermissionsAsync();
    const authStatus = await messaging().requestPermission();
    
    const isAuthorized = 
    authStatus === messaging.AuthorizationStatus.AUTHORIZED || 
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    
    if(isAuthorized){
    //if (permission.granted) {
      // Get the Expo push token (not the FCM token)
      /*const token = (await Notifications.getExpoPushTokenAsync(
        {projectId: "3cbc4f04-0c5c-424d-8b7b-4a8f1aceb361"}
      )).data;*/
      const token = await messaging().getToken();
      console.error('FCM Token:', token);
      
      // Optionally send this token to your server
      //console.error("Expo Push Token:", token);
      
      // Now you can subscribe to topics or send this token to your server
      await subscribeToTopic({ token, topic: id });

      return token;
    } else {
      console.error('Permission denied');
    }
  } catch (err) {
    console.error('Error requesting notification permission:', err);
  }
};
