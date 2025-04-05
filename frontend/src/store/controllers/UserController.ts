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
import { UserSelfDetails } from "@/pages/Dashboard/Dashboard/components/EditSelfDetailsModal";
import { ProjectDetailsRequestDTO } from "../dtos/request/projectDetailsRequestDTO";

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

export const updateSelfDetailsHandler = async (
  body: UserSelfDetails,
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
    dispatch(updateUserLoadingState(true));
    const headers = {
      Authorization: authorizationToken,
      "Content-Type": "multipart/form-data",
    };
    const formData = new FormData();
    formData.append("firstName", body.firstName);
    formData.append("lastName", body.lastName);
    formData.append("selfDescription", body.selfDescription);
    formData.append(
      "socialMediaHandles",
      JSON.stringify(body.socialMediaHandles)
    );
    if (body.profilePicture) {
      formData.append("profilePicture", body.profilePicture);
    }

    console.log("headers : ", headers);
    const { data } = await axios.put("/api/updateProfile", formData, {
      headers: headers,
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
    dispatch(updateUserLoadingState(false));
  }
};

export const createProjectHandler = async (
  body: ProjectDetailsRequestDTO,
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
    dispatch(updateUserLoadingState(true));
    const headers = {
      Authorization: authorizationToken,
      "Content-Type": "multipart/form-data",
    };
    const formData = new FormData();
    formData.append("title", body.title);
    formData.append("description", body.description);
    formData.append("existingMedia", JSON.stringify(body.existingMedia));
    formData.append("externalLinks", JSON.stringify(body.externalLinks));
    body.mediaFiles.forEach((file) => {
      formData.append("mediaFiles", file);
    });

    const { data } = await axios.put("/api/addProject", formData, {
      headers: headers,
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
    dispatch(updateUserLoadingState(false));
  }
};

export const updateProjectHandler = async (
  body: ProjectDetailsRequestDTO,
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
    dispatch(updateUserLoadingState(true));
    const headers = {
      Authorization: authorizationToken,
      "Content-Type": "multipart/form-data",
    };
    const formData = new FormData();

    formData.append("title", body.title);
    formData.append("description", body.description);
    formData.append("existingMedia", JSON.stringify(body.existingMedia));
    formData.append("externalLinks", JSON.stringify(body.externalLinks));

    body.mediaFiles.forEach((file) => {
      formData.append("mediaFiles", file);
    });

    const { data } = await axios.put(
      `/api/updateProject?workId=${body.projectId}`,
      formData,
      {
        headers: headers,
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
    dispatch(updateUserLoadingState(false));
  }
};

export const deleteProjectHandler = async (
  projectId: number,
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
    dispatch(updateUserLoadingState(true));
    const headers = {
      Authorization: authorizationToken,
    };

    const { data } = await axios.delete(
      `/api/deleteProject?workId=${projectId}`,
      {
        headers: headers,
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
    dispatch(updateUserLoadingState(false));
  }
};

export const getUserProfileDetailsById = async (
  userId: string,
  dispatch: typeof dispatchType
) => {
  try {
    const authorizationToken = localStorage.getItem(AUTHORIZATION_TOKEN);
    if (!authorizationToken) {
      return {
        success: false,
        message: "Please login in to access this functionality",
        user: null,
      };
    }
    dispatch(updateUserLoadingState(true));
    const headers = {
      Authorization: authorizationToken,
    };

    const { data } = await axios.get(`/api/getUserProfile?userId=${userId}`, {
      headers: headers,
    });
    const { success, message, user } = data;
    selfDetails(dispatch, authorizationToken);

    return {
      message,
      success,
      user,
    };
  } catch (err) {
    if (err instanceof AxiosError) {
      return {
        message: err.response?.data?.message || "Something went wrong",
        success: false,
        user: null,
      };
    }

    if (err instanceof Error) {
      return {
        message: err.message,
        success: false,
        user: null,
      };
    }

    return {
      message: "Unknown error occurred",
      success: false,
      user: null,
    };
  } finally {
    dispatch(updateUserLoadingState(false));
  }
};
