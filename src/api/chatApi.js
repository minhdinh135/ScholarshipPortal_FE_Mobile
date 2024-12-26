const BASE_URL = `${process.env.BASE_URL}/api/chats`;

export const getAllMessagings = async (receiverId) => {
  try {
    const res = await fetch(`${BASE_URL}/all-messages/${receiverId}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error fetching chats: ", error);
  }
}

export const chatHistory = async (userId, contactId) => {
  try {
    const res = await fetch(`${BASE_URL}/history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, contactId }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error fetching chat history: ", error);
  }
}

export const sendMessage = async (messageData) => {
  try {
    const res = await fetch(`${BASE_URL}/send-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error sending message: ", error);
  }
}