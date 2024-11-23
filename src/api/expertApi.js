const URL = `${process.env.BASE_URL}/api/experts`;

export const getApplicationByExpertId = async (id) => {
  try {
    const res = await fetch(`${URL}/${id}/assigned-applications`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching the assigned application: ", error);
  }
};

export const reviewApplication = async () => {
  try {
    const res = await fetch(`${URL}/reviews/result`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error reviewing the application: ", error);
  }
};