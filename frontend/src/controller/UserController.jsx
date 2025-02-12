import axios from "axios";
export const registerUserController = async (body) => {
  const response = await axios.post("/api/register", body);
  const { success, message } = response.data;
  return { success, message };
};

export const loginUserController = async (body) => {
  const response = await axios.post("/api/apiLogin", body);
  return response;
};
