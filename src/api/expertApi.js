const BASE_URL = `${process.env.BASE_URL}/api/experts`;

export const getApplicationByExpertId = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}/assigned-applications`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error fetching the assigned application: ", error);
  }
};

export const getScholarProgramByExpertId = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}/assigned-programs`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error fetching the assigned scholarship programs: ", error);
  }
};

export const reviewApplication = async () => {
  try {
    const res = await fetch(`${BASE_URL}/reviews/result`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error reviewing the application: ", error);
  }
};