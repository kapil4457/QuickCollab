// import { useSelector } from "react-redux";
import { loginRequestDTO } from "../dtos/request/loginRequestDTO";
import axios, { AxiosError } from "axios";
import { createUserDTO } from "../dtos/request/createUserDTO";
import {
  dispatchType,
  updateUserLoadingState,
  updateUser,
} from "../slices/userSlice";
import { AUTHORIZATION_TOKEN } from "@/constants/AppConstants";

export const loginUserHandler = async (
  body: loginRequestDTO,
  dispatch: typeof dispatchType
) => {
  try {
    dispatch(updateUserLoadingState(true));
    const { data, headers } = await axios.post("/api/apiLogin", body);
    const { message, success, user } = data;
    const { authorization } = headers;
    dispatch(
      updateUser({ user: user, jwtToken: authorization, loading: false })
    );
    localStorage.setItem(AUTHORIZATION_TOKEN, authorization);
    return {
      message,
      success,
    };
  } catch (err) {
    if (err instanceof AxiosError) {
      return {
        message: err.response?.data?.message || "Something went wrong",
        success: false,
      };
    }
    if (err instanceof Error) {
      return {
        message: err.message,
        success: false,
      };
    }
    return {
      message: "Unknown error occurred",
      success: false,
    };
  } finally {
    dispatch(updateUserLoadingState(false));
  }
};

export const registerUserHandler = async (
  body: createUserDTO,
  dispatch: typeof dispatchType
) => {
  try {
    dispatch(updateUserLoadingState(true));
    const { data, headers } = await axios.post("/api/register", body);
    const { message, success, user } = data;
    const { authorization } = headers;
    dispatch(
      updateUser({ user: user, jwtToken: authorization, loading: false })
    );
    localStorage.setItem(AUTHORIZATION_TOKEN, authorization);
    return {
      message,
      success,
    };
  } catch (err) {
    if (err instanceof AxiosError) {
      return {
        message: err.response?.data?.message || "Something went wrong",
        success: false,
      };
    }

    if (err instanceof Error) {
      return {
        message: err.message,
        success: false,
      };
    }

    return {
      message: "Unknown error occurred",
      success: false,
    };
  } finally {
    dispatch(updateUserLoadingState(false));
  }
};

export const selfDetails = async (
  dispatch: typeof dispatchType,
  authorizationToken: string
) => {
  try {
    dispatch(updateUserLoadingState(true));
    const headers = {
      Authorization: authorizationToken,
    };
    const { data } = await axios.get("/api/me", {
      headers,
    });
    const { success, user } = data;
    if (!success) {
      localStorage.removeItem(AUTHORIZATION_TOKEN);
      return { success: false };
    }
    dispatch(
      updateUser({
        user: user,
        jwtToken: authorizationToken,
        loading: false,
      })
    );
    return { success: true };
  } catch (err) {
    return { success: false };
  } finally {
    dispatch(updateUserLoadingState(false));
  }
};

export const logoutUserHandler = async (dispatch: typeof dispatchType) => {
  try {
    const authorizationToken = localStorage.getItem(AUTHORIZATION_TOKEN);
    if (authorizationToken == null) return;
    dispatch(updateUserLoadingState(true));
    const headers = {
      Authorization: authorizationToken,
    };
    await axios.post("/api/apiLogout", {
      headers,
    });
    localStorage.removeItem(AUTHORIZATION_TOKEN);
  } catch (err) {
    if (err instanceof AxiosError) {
      return {
        message: err.response?.data?.message || "Something went wrong",
        success: false,
      };
    }

    if (err instanceof Error) {
      return {
        message: err.message,
        success: false,
      };
    }

    return {
      message: "Unknown error occurred",
      success: false,
    };
  } finally {
    localStorage.removeItem(AUTHORIZATION_TOKEN);
    dispatch(
      updateUser({
        user: null,
        jwtToken: "",
        loading: false,
      })
    );
  }
};
