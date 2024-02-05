import requestHandler from "@/utils/requestHelper";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type useValueProps = {
  success: boolean | null;
  loading: boolean;
  message: string;
};
type initialStateProps = {
  createJobVal: useValueProps;
  deleteJobVal: {
    success: boolean | null;
    loading: boolean;
    message: string;
  };
  updateJobVal: {
    success: boolean | null;
    loading: boolean;
    message: string;
  };
};

const initialState = {
  createJobVal: {
    success: null,
    loading: true,
    message: "",
  } as useValueProps,
  deleteJobVal: {
    success: null,
    loading: true,
    message: "",
  },
  updateJobVal: {
    success: null,
    loading: true,
    message: "",
  },
} as initialStateProps;

export const createJob = createAsyncThunk("job/createJob", async (info) => {
  const data = await requestHandler(info, "POST", `/api/v1/create/job`);
  if (data.success) {
    return data;
  }
  return {
    success: data.success,
    message: data.message,
  };
});

export const deleteJob = createAsyncThunk("job/deleteJob", async (id) => {
  const data = await requestHandler({}, "DELETE", `/api/v1/delete/job/${id}`);
  if (data.success) {
    return data;
  }
  return {
    success: data.success,
    message: data.message,
  };
});
export const updateJob = createAsyncThunk("job/updateJob", async (info) => {
  const data = await requestHandler(info, "PUT", `/api/v1/update/job`);
  if (data.success) {
    return data;
  }
  return {
    success: data.success,
    message: data.message,
  };
});

export const jobSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    createJobReset: (state, action) => {
      // console.log("I am in");
      state.createJobVal.success = null;
      state.createJobVal.message = "";
      state.createJobVal.loading = false;
    },
    deleteJobReset: (state, action) => {
      // console.log("I am in");
      state.deleteJobVal.success = null;
      state.deleteJobVal.message = "";
      state.deleteJobVal.loading = false;
    },
    updateJobReset: (state, action) => {},
  },

  extraReducers: (builder) => {
    //    create new Job
    builder.addCase(createJob.fulfilled, (state, action) => {
      state.createJobVal.message = action.payload.message;
      state.createJobVal.loading = false;
      state.createJobVal.success = action.payload.success;
    });
    builder.addCase(createJob.rejected, (state, action) => {
      state.createJobVal.loading = false;
      state.createJobVal.message = action.error.message as string;
      state.createJobVal.success = false;
    });
    builder.addCase(createJob.pending, (state, action) => {
      state.createJobVal.loading = true;
      state.createJobVal.message = "Fetching jobs";
      state.createJobVal.success = null;
    });

    // update job
    builder.addCase(updateJob.fulfilled, (state, action) => {
      state.updateJobVal.message = action.payload.message;
      state.updateJobVal.loading = false;
      state.updateJobVal.success = action.payload.success;
    });
    builder.addCase(updateJob.rejected, (state, action) => {
      state.updateJobVal.loading = false;
      state.updateJobVal.message = action.error.message as string;
      state.updateJobVal.success = false;
    });
    builder.addCase(updateJob.pending, (state, action) => {
      state.updateJobVal.loading = true;
      state.updateJobVal.message = "Fetching jobs";
      state.updateJobVal.success = null;
    });
    // delete job
    builder.addCase(deleteJob.fulfilled, (state, action) => {
      state.deleteJobVal.message = action.payload.message;
      state.deleteJobVal.loading = false;
      state.deleteJobVal.success = action.payload.success;
    });
    builder.addCase(deleteJob.rejected, (state, action) => {
      state.deleteJobVal.loading = false;
      state.deleteJobVal.message = action.error.message as string;
      state.deleteJobVal.success = false;
    });
    builder.addCase(deleteJob.pending, (state, action) => {
      state.deleteJobVal.loading = true;
      state.deleteJobVal.message = "Fetching jobs";
      state.deleteJobVal.success = null;
    });
  },
});

export default jobSlice.reducer;
export const { createJobReset, deleteJobReset, updateJobReset } =
  jobSlice.actions;
