const URL = "https://ssap-backend.azurewebsites.net/api/notifications"

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