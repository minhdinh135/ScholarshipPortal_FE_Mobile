import { subscribeToTopic } from '../api/notificationApi';
import messaging from '@react-native-firebase/messaging';

export const requestNotify = async (id) => {
  try {
    const authStatus = await messaging().requestPermission();
    
    const isAuthorized = 
    authStatus === messaging.AuthorizationStatus.AUTHORIZED || 
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    
    if(isAuthorized){
      const token = await messaging().getToken();
      await subscribeToTopic({ token, topic: id });
      return token;
    } else {
      console.error('Permission denied');
    }
  } catch (err) {
    console.error('Error requesting notification permission:', err);
  }
};
