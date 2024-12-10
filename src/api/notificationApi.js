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

