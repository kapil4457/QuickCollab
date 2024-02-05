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
  allJobs: {
    success: boolean | null;
    loading: boolean;
    message: string;
    jobs: [] | null;
  };
  applyToJob: {
    success: boolean | null;
    loading: boolean;
    message: string;
  };
};

const initialState = {
  createJobVal: {
    success: null,
    loading: false,
    message: "",
  } as useValueProps,
  deleteJobVal: {
    success: null,
    loading: false,
    message: "",
  },
  updateJobVal: {
    success: null,
    loading: false,
    message: "",
  },
  allJobs: {
    success: null,
    loading: false,
    message: "",
    jobs: null,
  },
  applyToJob: {
    success: null,
    loading: false,
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

export const allJobs = createAsyncThunk("jobs/allJobs", async (filters) => {
  const data = await requestHandler(
    { filters: filters },
    "POST",
    "/api/v1/fetch/jobs"
  );
  if (data.success) {
    return data;
  }
  return {
    success: data.success,
    message: data.message,
    users: [],
  };
});

export const applyToJob = createAsyncThunk("jobs/applyToJob", async (jobId) => {
  const data = await requestHandler({}, "PUT", `/api/v1/apply/job/${jobId}`);
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
    updateJobReset: (state, action) => {
      state.updateJobVal.success = null;
      state.updateJobVal.message = "";
      state.updateJobVal.loading = false;
    },
    allJobsReset: (state, action) => {
      state.allJobs.success = null;
      state.allJobs.message = "";
      state.allJobs.loading = false;
    },
    applyToJobReset: (state, action) => {
      state.applyToJob.success = null;
      state.applyToJob.message = "";
      state.applyToJob.loading = false;
    },
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
    // all job
    builder.addCase(allJobs.fulfilled, (state, action) => {
      state.allJobs.message = action.payload.message;
      state.allJobs.loading = false;
      state.allJobs.success = action.payload.success;
      state.allJobs.jobs = action.payload.jobs;
    });
    builder.addCase(allJobs.rejected, (state, action) => {
      state.allJobs.loading = false;
      state.allJobs.message = action.error.message as string;
      state.allJobs.success = false;
      state.allJobs.jobs = null;
    });
    builder.addCase(allJobs.pending, (state, action) => {
      state.allJobs.loading = true;
      state.allJobs.message = "Fetching jobs";
      state.allJobs.success = null;
    });
    // apply to job
    builder.addCase(applyToJob.fulfilled, (state, action) => {
      state.applyToJob.message = action.payload.message;
      state.applyToJob.loading = false;
      state.applyToJob.success = action.payload.success;
    });
    builder.addCase(applyToJob.rejected, (state, action) => {
      state.applyToJob.loading = false;
      state.applyToJob.message = action.error.message as string;
      state.applyToJob.success = false;
    });
    builder.addCase(applyToJob.pending, (state, action) => {
      state.applyToJob.loading = true;
      state.applyToJob.message = "Fetching jobs";
      state.applyToJob.success = null;
    });
  },
});

export default jobSlice.reducer;
export const {
  createJobReset,
  deleteJobReset,
  updateJobReset,
  allJobsReset,
  applyToJobReset,
} = jobSlice.actions;
