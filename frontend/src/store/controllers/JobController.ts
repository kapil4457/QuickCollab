import axios, { AxiosError } from "axios";
import { createJobDTO } from "../dtos/request/createJobDTO";
import {
  dispatchType,
  updatePostedJobs,
  updateUserLoadingState,
} from "../slices/userSlice";
import { AUTHORIZATION_TOKEN } from "@/constants/AppConstants";

export const createJobPostingHandler = async (
  body: createJobDTO,
  dispatch: typeof dispatchType
) => {
  try {
    const authorizationToken = localStorage.getItem(AUTHORIZATION_TOKEN);
    if (!authorizationToken) {
      return {
        success: false,
        message: "Please login in to access ths functionality",
      };
    }
    const headers = {
      Authorization: authorizationToken,
    };
    dispatch(updateUserLoadingState(true));
    const { data } = await axios.post("/api/createJob", body, {
      headers,
    });
    const { message, success, jobs } = data;
    dispatch(updatePostedJobs(jobs));
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
export const updateJobPostingHandler = async (
  body: createJobDTO,
  dispatch: typeof dispatchType,
  jobId: string
) => {
  try {
    const authorizationToken = localStorage.getItem(AUTHORIZATION_TOKEN);
    if (!authorizationToken) {
      return {
        success: false,
        message: "Please login in to access ths functionality",
      };
    }
    const headers = {
      Authorization: authorizationToken,
    };
    dispatch(updateUserLoadingState(true));
    const { data } = await axios.put(`/api/updateJob?jobId=${jobId}`, body, {
      headers,
    });
    const { message, success, jobs } = data;
    dispatch(updatePostedJobs(jobs));
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
