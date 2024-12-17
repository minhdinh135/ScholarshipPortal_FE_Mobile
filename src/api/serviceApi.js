const BASE_URL = `${process.env.BASE_URL}/api/services`;

export const getServices = async (params = {}) => {
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

export const countServices = async () => {
  try {
    const res = await fetch(`${BASE_URL}/count`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error fetching count services: ", error);
  }
}

export const getServicesByProviderId = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/by-provider-id/${id}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error fetching services by provider: ", error);
  }
}