import requestHandler from "@/utils/requestHelper";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type useValueProps = {
  loading: boolean;
  message: string;
  success: boolean;
};
type initialStateProps = {
  value: useValueProps;
  deleteValue: {
    success: boolean | null;
    message: string;
  };
  updateValue: {
    success: boolean | null;
    message: string;
  };
};

const initialState = {
  value: {
    loading: true,
    message: "",
    success: false,
  } as useValueProps,
  deleteValue: {
    success: null,
    message: "",
  },
  updateValue: {
    message: "",
    success: null,
  },
} as initialStateProps;

export const addNewProjectReducer = createAsyncThunk(
  "project/addNewProject",
  async (projectDetails) => {
    const data = await requestHandler(
      projectDetails,
      "POST",
      `/api/v1/me/create/project`
    );
    if (data.success) {
      return data;
    }
    return {
      success: data.success,
      message: data.message,
    };
  }
);

export const deleteProject = createAsyncThunk(
  "project/deleteProject",
  async (id) => {
    const data = await requestHandler(
      {},
      "DELETE",
      `/api/v1/me/delete/project/${id}`
    );

    if (data.success) {
      return data;
    }
    return {
      success: data.success,
      message: data.message,
    };
  }
);

export const updateProject = createAsyncThunk(
  "project/updateProject",
  async (info) => {
    console.log("info : ", info);
    const data = await requestHandler(info, "PUT", "/api/v1/me/update/project");
    if (data.success) {
      return data;
    }
    return {
      success: data.success,
      message: data.message,
    };
  }
);

export const projectSlice = createSlice({
  name: "services",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addNewProjectReducer.fulfilled, (state, action) => {
      state.value.message = action.payload.message;
      state.value.loading = false;
      state.value.success = true;
    });
    builder.addCase(addNewProjectReducer.rejected, (state, action) => {
      state.value.message = action.error.message as string;
      state.value.loading = false;
      state.value.success = false;
    });
    builder.addCase(addNewProjectReducer.pending, (state, action) => {
      state.value.loading = true;
      state.value.message = "Uploading project";
    });

    //  delete project
    builder.addCase(deleteProject.fulfilled, (state, action) => {
      state.deleteValue.message = action.payload.message;
      state.deleteValue.success = action.payload.success;
    });
    builder.addCase(deleteProject.rejected, (state, action) => {
      state.deleteValue.message = action.error.message as string;
      state.deleteValue.success = false;
    });
    builder.addCase(deleteProject.pending, (state, action) => {
      state.deleteValue.success = null;
      state.deleteValue.message = "Deleting Project";
    });

    // Update Project
    builder.addCase(updateProject.fulfilled, (state, action) => {
      state.updateValue.message = action.payload.message;
      state.updateValue.success = action.payload.success;
    });
    builder.addCase(updateProject.rejected, (state, action) => {
      state.updateValue.message = action.error.message as string;
      state.updateValue.success = false;
    });
    builder.addCase(updateProject.pending, (state, action) => {
      state.updateValue.success = null;
      state.updateValue.message = "Updating Project";
    });
  },
});

export default projectSlice.reducer;
