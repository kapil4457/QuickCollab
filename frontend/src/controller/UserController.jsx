import axios from "axios";
export const registerUserController = async (body) => {
  const response = await axios.post("/api/register", body);
  return response;
};

export const loginUserController = async (body) => {
  const response = await axios.post("/api/apiLogin", body);
  return response;
};

export const logoutUserController = async (jwtToken) => {
  const response = await axios.post(
    "/api/apiLogout",
    {},
    {
      headers: {
        Authorization: jwtToken,
      },
    }
  );

  console.log("response : ", response);
  return response;
};
