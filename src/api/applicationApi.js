const URL = `https://ssap-backend.azurewebsites.net/api/applications`;

export const getApplicationById = async (id) => {
  try {
    const res = await fetch(`${URL}/${id}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching the scholarship programs: ", error);
  }
};

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

export const updateApplication = async (id, status) => {
  try {
    const res = await fetch(`${URL}/${id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: status }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error updating status application: ", error);
  }
}