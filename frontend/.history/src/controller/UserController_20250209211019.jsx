export const registerUserController = async (body) => {
  const response = await axios.post("/api/register", body);
  return response;
};
