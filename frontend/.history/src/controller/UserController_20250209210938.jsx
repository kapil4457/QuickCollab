export const registerUserController = async (body) => {
  const response = axios.post("/api/register", body);
  return response;
};
