const URL = `${process.env.BASE_URL}/api/universities`

export const getUniversity = async () => {
  try {
    const res = await fetch(URL);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching the scholarship programs: ", error);
  }
};

