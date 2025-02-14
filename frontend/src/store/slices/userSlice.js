import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    isAuthenticated: false,
    jwtToken: "",
  },
  reducers: {
    updateUserState: (state, action) => {
      state.user = action.payload.user;
    },
    updateLoggedInState: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
    },
    updateCurrentUserState: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.jwtToken = action.payload.jwtToken;
    },
  },
});

export const { updateUserState, updateLoggedInState, updateCurrentUserState } =
  userSlice.actions;
export default userSlice.reducer;
