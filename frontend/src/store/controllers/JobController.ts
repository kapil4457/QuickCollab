import axios, { AxiosError } from "axios";
import { createJobDTO } from "../dtos/request/createJobDTO";
import { dispatchType, updatePostedJobs } from "../slices/userSlice";
import { AUTHORIZATION_TOKEN } from "@/constants/AppConstants";
import { updateAllJobs, updateJobLoadingState } from "../slices/jobSlice";
import { selfDetails } from "./UserController";
import { OfferDetail } from "../dtos/helper";

export const createJobPostingHandler = async (
  body: createJobDTO,
  dispatch: typeof dispatchType
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
    };
    dispatch(updateJobLoadingState(true));
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
    dispatch(updateJobLoadingState(true));
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
        message: "Please login in to access this functionality",
      };
    }
    const headers = {
      Authorization: authorizationToken,
    };
    dispatch(updateJobLoadingState(true));
    const { data } = await axios.put(`/api/updateJob?jobId=${jobId}`, body, {
      headers,
    });
    const { message, success, jobs } = data;

    console.log("message : ", message);
    console.log("success : ", success);
    console.log("jobs : ", jobs);
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
    dispatch(updateJobLoadingState(true));
  }
};

export const getAllJobPostingsHandler = async (
  dispatch: typeof dispatchType
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
    };
    dispatch(updateJobLoadingState(true));
    const { data } = await axios.get("/api/getAllJobs", {
      headers,
    });
    const { jobs, success, message } = data;
    dispatch(updateAllJobs(jobs));
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
    dispatch(updateJobLoadingState(true));
  }
};

export const applyToJobHandler = async (
  dispatch: typeof dispatchType,
  jobId: string
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
    };
    console.log("headers : ", headers);
    dispatch(updateJobLoadingState(true));
    const { data } = await axios.post(
      `/api/applyForJob?jobId=${jobId}`,
      {},
      {
        headers,
      }
    );
    const { success, message } = data;
    selfDetails(dispatch, authorizationToken);
    getAllJobPostingsHandler(dispatch);
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
    dispatch(updateJobLoadingState(true));
  }
};

export const createJobOfferHandler = async (
  dispatch: typeof dispatchType,
  OfferDetails: OfferDetail
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
    };
    console.log("headers : ", headers);
    dispatch(updateJobLoadingState(true));
    const { data } = await axios.post(`/api/sendOffer`, OfferDetails, {
      headers,
    });
    const { success, message } = data;
    selfDetails(dispatch, authorizationToken);
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
    dispatch(updateJobLoadingState(true));
  }
};
export const updateJobOfferHandler = async (
  dispatch: typeof dispatchType,
  OfferDetails: OfferDetail
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
    };
    console.log("headers : ", headers);
    dispatch(updateJobLoadingState(true));
    const { data } = await axios.put("/api/reviseOffer", OfferDetails, {
      headers,
    });
    const { success, message } = data;
    selfDetails(dispatch, authorizationToken);
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
    dispatch(updateJobLoadingState(true));
  }
};

export const updateOfferStatusHandler = async (
  dispatch: typeof dispatchType,
  jobId: string,
  offerStatus: string
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
    };
    console.log("headers : ", headers);
    dispatch(updateJobLoadingState(true));
    const { data } = await axios.put(
      `/api/updateOfferStatus?jobId=${jobId}&offerStatus=${offerStatus}`,
      {},
      {
        headers,
      }
    );
    const { success, message } = data;
    selfDetails(dispatch, authorizationToken);
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
    dispatch(updateJobLoadingState(true));
  }
};

export const joinCompanyHandler = async (
  dispatch: typeof dispatchType,
  jobId: number
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
    };
    console.log("headers : ", headers);
    dispatch(updateJobLoadingState(true));
    const { data } = await axios.put(
      `/api/joinCompany?jobId=${jobId}`,
      {},
      {
        headers,
      }
    );
    const { success, message } = data;
    selfDetails(dispatch, authorizationToken);

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
    dispatch(updateJobLoadingState(true));
  }
};

export const updateEmployeeSalaryHandler = async (
  dispatch: typeof dispatchType,
  userId: string,
  updatedSalary: number
) => {
  //
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
    };
    console.log("headers : ", headers);
    dispatch(updateJobLoadingState(true));
    const { data } = await axios.put(
      `/api/updateEmployeeSalary?employeeId=${userId}&salary=${updatedSalary}`,
      {},
      {
        headers,
      }
    );
    const { success, message } = data;
    selfDetails(dispatch, authorizationToken);

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
    dispatch(updateJobLoadingState(true));
  }
};
