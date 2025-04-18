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
    console.log("Error fetching accounts: ", error);
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
    console.log("Error fetching the account by id: ", error);
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
    console.log("Error changing the password: ", error);
  }
};

export const resetPassword = async (id, email, newPassword) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, newPassword }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error forgoting the password: ", error);
  }
};

export const forgotPassword = async (email) => {
  try {
    const res = await fetch(`${BASE_URL}/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error forgoting the password: ", error);
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    const res = await fetch(`${BASE_URL}/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error forgoting the password: ", error);
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
    console.log("Error changing the avatar: ", error);
  }
};
