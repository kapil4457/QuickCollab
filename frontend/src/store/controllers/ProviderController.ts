import { AUTHORIZATION_TOKEN } from "@/constants/AppConstants";
import axios, { AxiosError } from "axios";
import { dispatchType, updateUserLoadingState } from "../slices/userSlice";
import { AddProviderDTO } from "../dtos/request/AddProviderDTO";

export const addProviderHandler = async (
  dispatch: typeof dispatchType,
  addProviderDTO: AddProviderDTO
) => {
  try {
    const authorizationToken = localStorage.getItem(AUTHORIZATION_TOKEN);
    if (!authorizationToken) {
      return {
        success: false,
        message: "Please login in to access this functionality",
      };
    }
    dispatch(updateUserLoadingState(true));
    const headers = {
      Authorization: authorizationToken,
    };
    const { data } = await axios.put("/api/addProvider", addProviderDTO, {
      headers,
    });
    const { success, message } = data;
    return {
      success,
      message,
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
