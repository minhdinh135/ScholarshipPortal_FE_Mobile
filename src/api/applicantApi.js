const URL = "http://10.0.2.2:5254/api/applications";

export const postApplication = async (applicationData) => {
  try {
    const res = await fetch(URL, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(applicationData),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error posting the application: ", error);
  }
};

