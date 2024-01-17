"use client";
import axios from "axios";

const getHandler = async (url: string) => {
  try {
    const config = {
      withCredentials: true,
    };
    const { data } = await axios.get(`http://localhost:8000${url}`, config);
    return {
      success: true,
      data,
    };
  } catch (err) {
    const { success, message } = err.response;
    return { success: success, message: message };
  }
};
const postHandler = async (url: string, info: any) => {
  try {
    console.log("info", info);
    const config = {
      // credentials: "include",
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    };
    const { data } = await axios.post(
      `http://localhost:8000${url}`,
      info,
      config
    );
    return data;
  } catch (err) {
    console.log(err);
    const { data } = err.response;
    return { success: data.success, message: data.message };
  }
};
const requestHandler = async (
  data: any,
  requestType: "POST" | "GET",
  url: string
) => {
  console.log("Inside the request handler...");
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
