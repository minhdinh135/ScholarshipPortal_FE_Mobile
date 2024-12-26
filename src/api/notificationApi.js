import messaging from '@react-native-firebase/messaging';

const BASE_URL = `${process.env.BASE_URL}/api/notifications`;

export const getNotification = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/get-all-by-id/${id}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error fetching the notifications: ", error);
  }
};

export async function subscribeToTopic(data) {
  const res = await fetch(
    `${BASE_URL}/subscribe-to-topic`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    return result;
}

export const markAsRead = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/read/${id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error fetching the notifications: ", error);
  }
};

export const sendNotificationFunder = async (applicantId, scholarshipId) => {
  try {
    const res = await fetch(`${BASE_URL}/notify-funder-new-applicant?applicantId=${applicantId}&scholarshipId=${scholarshipId}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error sending notification for funder: ", error);
  }
};

export const sendNotificationProvider = async (applicantId, serviceId) => {
  try {
    const res = await fetch(`${BASE_URL}/notify-provider-new-request?applicantId=${applicantId}&serviceId=${serviceId}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
    })

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error sending notification for provider: ", error);
  }
};

export const subscribeToNotifications = async (userId) => {
  try {
    await messaging().requestPermission();
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    const res = await fetch(`${BASE_URL}/subscribe-to-topic`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: token,
        topic: userId,
      })
    })

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error subscribing to notifications: ", error);
  }
}
