const BASE_URL = `${process.env.BASE_URL}/api/applicants`;

export const getApplicantById = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}/applications`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error fetching applicants: ", error);
  }
};

export const getApplicantProfileById = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error fetching applicant profile: ", error);
  }
}

export const addApplicantExperience = async (id, formData) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}/profile-experience`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error adding experience profile: ", error);
  }
}

export const updateApplicantExperience = async (id, experienceId, formData) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}/profile-experience/${experienceId}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error updating experience profile: ", error);
  }
}

export const addApplicantEducation = async (id, formData) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}/profile-education`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error adding education profile: ", error);
  }
}

export const updateApplicantEducation = async (id, educationId, formData) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}/profile-education/${educationId}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error updating education profile: ", error);
  }
}

export const addApplicantSkill = async (id, formData) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}/profile-skill`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error adding skill profile: ", error);
  }
}

export const updateApplicantSkill = async (id, skillId, formData) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}/profile-skill/${skillId}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error updating skill profile: ", error);
  }
}

export const addApplicantCertificate = async (id, formData) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}/profile-certificate`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error adding certificate profile: ", error);
  }
}

export const updateApplicantCertificate = async (id, certificateId, formData) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}/profile-certificate/${certificateId}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error updating certificate profile: ", error);
  }
}