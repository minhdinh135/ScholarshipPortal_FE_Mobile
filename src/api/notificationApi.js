const URL = "http://10.0.2.2:5254/api/notifications"

export const getNotification = async (id) => {
  try {
    const res = await fetch(`${URL}/get-all-by-id/${id}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching the notifications: ", error);
  }
};