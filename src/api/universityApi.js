// const BASE_URL = `${process.env.BASE_URL}/api/universities`
import { URL } from ".";
const BASE_URL = `${URL}/api/universities`

export const getUniversity = async () => {
  try {
    const res = await fetch(BASE_URL);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching the universities: ", error);
  }
};

