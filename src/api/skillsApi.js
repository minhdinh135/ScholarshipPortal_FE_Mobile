const BASE_URL = `${process.env.BASE_URL}/api`;

export const getSkills = async () => {
  try {
    const res = await fetch(`${BASE_URL}/skills`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error fetching skilss: ", error);
  }
};

export const getCertificates = async () => {
  try {
    const res = await fetch(`${BASE_URL}/certificates`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error fetching skilss: ", error);
  }
};
