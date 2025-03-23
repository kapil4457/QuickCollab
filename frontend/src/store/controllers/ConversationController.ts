import { AUTHORIZATION_TOKEN } from "@/constants/AppConstants";
import {
  dispatchType,
  // updateLocalConversationByConversationId,
} from "../slices/userSlice";
import { updateUserLoadingState } from "../slices/userSlice";
import axios, { AxiosError } from "axios";
import { selfDetails } from "./UserController";
import { createConversationDTO } from "../dtos/request/conversationCreateDTO";
import { MessageRequestDTO } from "../dtos/request/MessageRequestDTO";
import { updateConversations } from "../slices/conversationSlice";

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

export const insertMessage = async (
  dispatch: typeof dispatchType,
  body: MessageRequestDTO
) => {
  try {
    const authorizationToken = localStorage.getItem(AUTHORIZATION_TOKEN);
    if (!authorizationToken) {
      return {
        success: false,
        message: "Please login in to access this functionality",
      };
    }
    const headers = {
      Authorization: authorizationToken,
      "Content-Type": "multipart/form-data",
    };
    const formData = new FormData();
    formData.append("message", body.message);
    formData.append("conversationId", body.conversationId.toString());
    formData.append("messageType", body.messageType);
    if (body.media) formData.append("media", body.media);
    const { data } = await axios.put("/api/insertMessage", formData, {
      headers: headers,
    });
    const { success, message } = data;
    if (!success) {
      return {
        message: message,
        success: false,
      };
    }
    return {
      message: message,
      success: success,
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
  }
};

export const getAllConversations = async (dispatch: typeof dispatchType) => {
  try {
    const authorizationToken = localStorage.getItem(AUTHORIZATION_TOKEN);
    if (!authorizationToken) {
      return {
        success: false,
        message: "Please login in to access this functionality",
        conversations: null,
      };
    }
    const headers = {
      Authorization: authorizationToken,
    };
    const { data } = await axios.get("/api/all/conversations", {
      headers: headers,
    });
    const { success, message, conversations } = data;
    if (!success) {
      return {
        message: message,
        success: false,
        conversations: null,
      };
    }

    dispatch(updateConversations(conversations));

    return {
      message: message,
      success: success,
      conversations: conversations,
    };
  } catch (err) {
    if (err instanceof AxiosError) {
      return {
        message: err.response?.data?.message || "Something went wrong",
        success: false,
        conversations: null,
      };
    }

    if (err instanceof Error) {
      return {
        message: err.message,
        success: false,
        conversations: null,
      };
    }

    return {
      message: "Unknown error occurred",
      success: false,
      conversations: null,
    };
  }
};
