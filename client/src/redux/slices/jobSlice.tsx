import requestHandler from "@/utils/requestHelper";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type useValueProps = {
  success: boolean | null;
  loading: boolean;
  message: string;
};
type initialStateProps = {
  createJobVal: useValueProps;
};

const initialState = {
  createJobVal: {
    success: null,
    loading: true,
    message: "",
  } as useValueProps,
} as initialStateProps;

export const createJob = createAsyncThunk(
  "profile/fetchedUserDetails",
  async (info) => {
    const data = await requestHandler(info, "POST", `/api/v1/create/job`);
    if (data.success) {
      return data;
    }
    return {
      success: data.success,
      message: data.message,
    };
  }
);

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
  },

  //    create new Job
  extraReducers: (builder) => {
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
  },
});

export default jobSlice.reducer;
