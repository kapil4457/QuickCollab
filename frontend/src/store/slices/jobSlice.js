import { createSlice } from "@reduxjs/toolkit";
const jobSlice = createSlice({
  name: "job",
  initialState: {
    userListedJobs: [],
  },
  reducers: {
    updateUserListedJobs: (state, action) => {
      state.userListedJobs = action.payload.userListedJobs;
    },
  },
});

export const { updateUserListedJobs } = jobSlice.actions;
export default jobSlice.reducer;
