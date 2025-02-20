import axios from "axios";

export const getSelfListedJobs = async (jwtToken) => {
  const response = await axios.get("/api/getUserListedJobs", {
    headers: {
      Authorization: jwtToken,
    },
  });
  return response;
};

export const createJob = async (body, jwtToken) => {
  {
    const response = await axios.post("/api/createJob", body, {
      headers: {
        Authorization: jwtToken,
      },
    });
    return response;
  }
};

export const updateJob = async (body, jwtToken, jobId) => {
  {
    const response = await axios.put(`/api/updateJob?jobId=${jobId}`, body, {
      headers: {
        Authorization: jwtToken,
      },
    });
    return response;
  }
};

export const getAllJobs = async (jwtToken) => {
  const response = await axios.get("/api/getAllJobs", {
    headers: {
      Authorization: jwtToken,
    },
  });
  return response;
};
