const BASE_URL = `${process.env.BASE_URL}/api/payments`;

export const getTransactionByWalletId = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/transactions/${id}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching transaction by wallet id: ", error);
  }
};

export const transferMoney = async (moneyData) => {
  try {
    const res = await fetch(`${BASE_URL}/transfer-money`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(moneyData)
    })

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error transfering money: ", error);
  }
};
