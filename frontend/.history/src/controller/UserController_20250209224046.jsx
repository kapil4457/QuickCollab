import axios from "axios";
export const registerUserController = async (body) => {
  const response = await axios.post("/api/register", body);
  return response;
};

export const loginUserController = async (body) => {
  const response = await axios.post("/api/login", body);
  return response;
};
