const BASE_URL = `${process.env.BASE_URL}/api/accounts`;

export const getAccounts = async () => {
  try {
    const res = await fetch(BASE_URL);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching accounts: ", error);
  }
};

export const getAccountById = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching the account by id: ", error);
  }
};

export const changePassword = async (id, email, oldPassword, newPassword) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        oldPassword: oldPassword,
        newPassword: newPassword,
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error changing the password: ", error);
  }
};

export const changeAvatar = async (id, files) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}/change-avatar`, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: files,
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error changing the password: ", error);
  }
};
