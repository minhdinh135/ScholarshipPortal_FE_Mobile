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
    console.log("Error fetching wallet: ", error);
  }
};

export const createWallet = async (id, walletData) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}/wallet`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(walletData),
    })

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error creating wallet: ", error);
  }
}