import { createSlice } from "@reduxjs/toolkit";

type useValueProps = {
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
  message: string;
};
type initialStateProps = {
  value: useValueProps;
};

const initialState = {
  value: {
    isAuthenticated: false,
    user: null,
    loading: true,
    message: "",
  } as useValueProps,
} as initialStateProps;

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      const { user, success, message, loading } = action.payload;
      // console.log("I am in");
      state.value.loading = loading;
      state.value.message = message;
      state.value.user = user;
      if (success) {
        state.value.isAuthenticated = true;
      } else {
        state.value.isAuthenticated = false;
      }
    },
  },
});

export default userSlice.reducer;
export const { setUserData } = userSlice.actions;
