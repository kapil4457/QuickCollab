export const registerUserController = async (body) => {
  axios.post("/api/register", body);
};
