const BASE_URL = `${process.env.BASE_URL}/api/accounts`;

export const getWalletById = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}/wallet`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching wallet: ", error);
  }
};