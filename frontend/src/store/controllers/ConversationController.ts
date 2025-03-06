import { AUTHORIZATION_TOKEN } from "@/constants/AppConstants";
import { dispatchType } from "../slices/userSlice";
import { updateUserLoadingState } from "../slices/userSlice";
import axios, { AxiosError } from "axios";
import { selfDetails } from "./UserController";
import { createConversationDTO } from "../dtos/request/conversationCreateDTO";

export const createConversation = async (
  dispatch: typeof dispatchType,
  body: createConversationDTO
) => {
  try {
    const authorizationToken = localStorage.getItem(AUTHORIZATION_TOKEN);
    if (!authorizationToken) {
      return {
        success: false,
        message: "Please login in to access this functionality",
        conversationId: null,
      };
    }
    const headers = {
      Authorization: authorizationToken,
    };
    dispatch(updateUserLoadingState(true));
    const { data } = await axios.post(`/api/createConversation`, body, {
      headers,
    });
    const { success, message, conversationId } = data;
    selfDetails(dispatch, authorizationToken);
    return {
      message,
      success,
      conversationId,
    };
  } catch (err) {
    if (err instanceof AxiosError) {
      return {
        message: err.response?.data?.message || "Something went wrong",
        success: false,
        conversationId: null,
      };
    }

    if (err instanceof Error) {
      return {
        message: err.message,
        success: false,
        conversationId: null,
      };
    }

    return {
      message: "Unknown error occurred",
      conversationId: null,
      success: false,
    };
  } finally {
    dispatch(updateUserLoadingState(false));
  }
};
