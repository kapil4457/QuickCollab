import { createSlice } from "@reduxjs/toolkit";
const jobSlice = createSlice({
  name: "job",
  initialState: {
    userListedJobs: [],
    allJobs: [],
  },
  reducers: {
    updateUserListedJobs: (state, action) => {
      state.userListedJobs = action.payload.userListedJobs;
    },
    updateAllJobs: (state, action) => {
      state.allJobs = action.payload.allJobs;
    },
  },
});

export const { updateUserListedJobs, updateAllJobs } = jobSlice.actions;
export default jobSlice.reducer;
