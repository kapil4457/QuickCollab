"use client";
import axios from "axios";
import { ErrorProps } from "next/error";

const getHandler = async (url: string) => {
  try {
    const config = {
      withCredentials: true,
    };
    const { data } = await axios.get(`http://localhost:8000${url}`, config);
    return data;
  } catch (err) {
    const { message, success } = err.response.data;
    return { success: success, message: message };
  }
};
const postHandler = async (url: string, info: any) => {
  try {
    const config = {
      // credentials: "include",
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    };
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`,
      info,
      config
    );
    return data;
  } catch (err) {
    const { message, success } = err.response.data;
    return { success: success, message: message };
  }
};
const requestHandler = async (
  data: any,
  requestType: "POST" | "GET",
  url: string
) => {
  if (requestType === "POST") {
    const res = await postHandler(url, data);
    if (res.success === true) {
      return res;
    } else {
      return { success: false, message: res.message };
    }
  } else {
    const res = await getHandler(url);
    if (res.success === true) {
      return res;
    } else {
      return { success: false, message: res.message };
    }
  }
};

export default requestHandler;
