const URL = `https://ssap-backend.azurewebsites.net/api/scholarship-programs`;

export const getScholarProgram = async (params = {}) => {
  const {
    PageIndex = 1,
    PageSize = 3,
    SortBy = '',
    IsDescending = false,
    IsPaging = true
  } = params;

  try {
    const queryParams = new URLSearchParams({
      PageIndex: PageIndex.toString(),
      PageSize: PageSize.toString(),
      SortBy,
      IsDescending: IsDescending.toString(),
      IsPaging: IsPaging.toString()
    });

    const res = await fetch(`${URL}?${queryParams.toString()}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching the scholarship programs: ", error);
  }
};

export const getScholarProgramById = async (id) => {
  try {
    const res = await fetch(`${URL}/${id}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching the scholarship programs by id: ", error);
  }
};
