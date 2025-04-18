const BASE_URL = `${process.env.BASE_URL}/api/scholarship-programs`;

export const getScholarProgram = async (params = {}) => {
  const {
    PageIndex = 1,
    PageSize = 3,
    SortBy = "",
    IsDescending = false,
    IsPaging = true,
  } = params;

  try {
    const queryParams = new URLSearchParams({
      PageIndex: PageIndex.toString(),
      PageSize: PageSize.toString(),
      SortBy,
      IsDescending: IsDescending.toString(),
      IsPaging: IsPaging.toString(),
    });

    const res = await fetch(`${BASE_URL}?${queryParams.toString()}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error fetching the scholarship programs: ", error);
  }
};

export const countScholarProgram = async () => {
  try {
    const res = await fetch(`${BASE_URL}/count`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error fetching count scholarships: ", error);
  }
}

export const getScholarProgramById = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error fetching the scholarship programs by id: ", error);
  }
};

export const getScholarProgramByMajorId = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/by-major-id/${id}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error fetching the scholarship programs by major id: ", error);
  }
};