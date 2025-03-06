import { createSlice } from "@reduxjs/toolkit";
import type {
  Dispatch,
  PayloadAction,
  ThunkDispatch,
  UnknownAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { JobSeekerJobDetailDTO } from "../dtos/response/JobSeekerJobResponseDTO";

// Define a type for the slice state

export interface JobState {
  allJobs: Array<JobSeekerJobDetailDTO>;
  loading: boolean;
}

export let dispatchType: ThunkDispatch<
  {
    allJobs: Array<JobSeekerJobDetailDTO>;
  },
  undefined,
  UnknownAction
> &
  Dispatch<UnknownAction>;

// Define the initial state using that type
const initialState: JobState = {
  allJobs: [],
  loading: false,
};

export const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    updateAllJobs: (state, action: PayloadAction<JobSeekerJobDetailDTO[]>) => {
      state.allJobs = action.payload;
    },
    updateJobLoadingState: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { updateAllJobs, updateJobLoadingState } = jobSlice.actions;

export const selectAllJobs = (state: RootState) => state.job.allJobs;
export const selectAllJobsLoading = (state: RootState) => state.job.loading;

export default jobSlice.reducer;
