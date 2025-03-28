import { AUTHORIZATION_TOKEN } from "@/constants/AppConstants";
import { UploadRequestDTO } from "../dtos/request/UploadRequestDTO";
import { dispatchType, updateUserLoadingState } from "../slices/userSlice";
import axios, { AxiosError } from "axios";
import { selfDetails } from "./UserController";
import { UploadRequestStatus } from "@/utils/enums";

export const createUploadRequestHandler = async (
  dispatch: typeof dispatchType,
  uploadRequestDTO: UploadRequestDTO
) => {
  try {
    console.log("request : ", uploadRequestDTO);
    const authorizationToken = localStorage.getItem(AUTHORIZATION_TOKEN);
    if (!authorizationToken) {
      return {
        success: false,
        message: "Please login in to access this functionality",
      };
    }
    dispatch(updateUserLoadingState(true));
    const formData = new FormData();

    if (uploadRequestDTO.media) {
      formData.append("media", uploadRequestDTO.media);
    }
    formData.append("description", uploadRequestDTO.description);
    formData.append("mediaType", uploadRequestDTO.mediaType || "");
    formData.append("title", uploadRequestDTO.title);
    formData.append("mediaUrl", uploadRequestDTO.mediaUrl || "");
    formData.append("tags", JSON.stringify(uploadRequestDTO.tags));
    formData.append(
      "uploadRequestStatus",
      uploadRequestDTO.uploadRequestStatus
    );
    formData.append("uploadTo", JSON.stringify(uploadRequestDTO.uploadTo));
    formData.append(
      "uploadTypeMapping",
      JSON.stringify(uploadRequestDTO.uploadTypeMapping)
    );
    const headers = {
      Authorization: authorizationToken,
      "Content-Type": "multipart/form-data",
    };
    const { data } = await axios.post("/api/createUploadRequest", formData, {
      headers,
    });
    selfDetails(dispatch, authorizationToken);
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
export const updateUploadRequestHandler = async (
  dispatch: typeof dispatchType,
  uploadRequestDTO: UploadRequestDTO,
  requestId: number
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
    const formData = new FormData();

    if (uploadRequestDTO.media) {
      formData.append("media", uploadRequestDTO.media);
    }
    formData.append("title", uploadRequestDTO.title);
    formData.append("description", uploadRequestDTO.description);
    formData.append("tags", JSON.stringify(uploadRequestDTO.tags));
    formData.append("uploadTo", JSON.stringify(uploadRequestDTO.uploadTo));
    formData.append("uploadRequestStatus", UploadRequestStatus.PENDING);
    formData.append(
      "uploadTypeMapping",
      JSON.stringify(uploadRequestDTO.uploadTypeMapping)
    );
    formData.append("mediaType", uploadRequestDTO.mediaType || "");
    const headers = {
      Authorization: authorizationToken,
      "Content-Type": "multipart/form-data",
    };
    const { data } = await axios.put(
      `/api/updateUploadRequest?requestId=${requestId}`,
      formData,
      {
        headers,
      }
    );
    selfDetails(dispatch, authorizationToken);
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

export const updateUploadRequestStatusHandler = async (
  dispatch: typeof dispatchType,
  newStatus: string,
  requestId: number
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
    const { data } = await axios.put(
      `/api/updateUploadRequestStatus?requestId=${requestId}&status=${newStatus}`,
      {},
      {
        headers,
      }
    );
    selfDetails(dispatch, authorizationToken);
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
