import requestHandler from "@/utils/requestHelper";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type useValueProps = {
  user: any;
  loading: boolean;
  message: string;
};
type initialStateProps = {
  value: useValueProps;
};

const initialState = {
  value: {
    user: null,
    loading: true,
    message: "",
  } as useValueProps,
} as initialStateProps;

export const fetchUserDetails = createAsyncThunk(
  "profile/fetchedUserDetails",
  async (id) => {
    const data = await requestHandler({}, "GET", `/api/v1/user/details/${id}`);
    if (data.success) {
      return data;
    }
    return {
      success: data.success,
      message: data.message,
      user: {},
    };
  }
);

export const profileSlice = createSlice({
  name: "services",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserDetails.fulfilled, (state, action) => {
      state.value.user = action.payload.user;
      state.value.message = "User details fetched successfully.";
      state.value.loading = false;
    });
    builder.addCase(fetchUserDetails.rejected, (state, action) => {
      state.value.user = null;
      state.value.loading = false;
      state.value.message = "Unable to fetch user details";
    });
    builder.addCase(fetchUserDetails.pending, (state, action) => {
      state.value.user = null;
      state.value.loading = true;
      state.value.message = "Fetching details";
    });
  },
});

export default profileSlice.reducer;
