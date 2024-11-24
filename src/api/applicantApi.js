const URL = `https://ssap-backend.azurewebsites.net/api/applicants`;

export const getApplicantById = async (id) => {
  try {
    const res = await fetch(`${URL}/${id}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching applicants: ", error);
  }
};
