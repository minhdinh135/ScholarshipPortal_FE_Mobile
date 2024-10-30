const URL = "http://10.0.2.2:5254/api/accounts"

export const getAccounts = async () => {
  try {
    const res = await fetch(URL);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching the scholarship programs: ", error);
  }
};

