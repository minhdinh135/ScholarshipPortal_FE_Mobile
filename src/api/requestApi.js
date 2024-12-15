const BASE_URL = `${process.env.BASE_URL}/api/requests`;

export const getRequestById = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}?ApplicantId=${id}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error fetching the requests by id: ", error);
  }
};