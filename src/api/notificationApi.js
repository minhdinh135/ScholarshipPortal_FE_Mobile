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