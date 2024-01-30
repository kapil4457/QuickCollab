"use client";
import axios from "axios";

const putHandler = async (url: string, info: any) => {
  try {
    const config = {
      // credentials: "include",
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    };

    const { data } = await axios.put(
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

const deleteHandler = async (url: string) => {
  try {
    const config = {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    };

    const { data } = await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`,
      config
    );
    return data;
  } catch (err) {
    const { message, success } = err.response.data;
    return { success: success, message: message };
  }
};

const getHandler = async (url: string) => {
  try {
    const config = {
      withCredentials: true,
    };
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`,
      config
    );
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
  requestType: "POST" | "GET" | "PUT" | "DELETE",
  url: string
) => {
  if (requestType === "POST") {
    const res = await postHandler(url, data);
    if (res.success === true) {
      return res;
    } else {
      return { success: false, message: res.message };
    }
  } else if (requestType === "GET") {
    const res = await getHandler(url);
    if (res.success === true) {
      return res;
    } else {
      return { success: false, message: res.message };
    }
  } else if (requestType === "PUT") {
    const res = await putHandler(url, data);
    if (res.success === true) {
      return res;
    } else {
      return { success: false, message: res.message };
    }
  } else if (requestType === "DELETE") {
    const res = await deleteHandler(url);
    if (res.success === true) {
      return res;
    } else {
      return { success: false, message: res.message };
    }
  }
};

export default requestHandler;
