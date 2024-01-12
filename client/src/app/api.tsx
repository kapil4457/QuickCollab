import axios from "axios";

export const API_URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:8000/";

const createInstance = (baseUrl: string) => {
  const instance = axios.create({
    baseURL: baseUrl,
    headers: { "Content-Type": "application/json" },
  });
  return instance;
};

export default createInstance(API_URL);
