import requestHandler from "@/utils/requestHelper";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type useValueProps = {
  users: any;
  loading: boolean;
  message: string;
};
type initialStateProps = {
  value: useValueProps;
};

const initialState = {
  value: {
    users: null,
    loading: true,
    message: "",
  } as useValueProps,
} as initialStateProps;

export const fetchServiceProviders = createAsyncThunk(
  "services/fetchServiceProviders",
  async (services) => {
    const data = await requestHandler(
      { services: services },
      "POST",
      "/api/v1/fetch/service-providers"
    );
    if (data.success) {
      return data;
    }
    return {
      success: data.success,
      message: data.message,
      users: [],
    };
  }
);

export const serviceSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    // serServices: (state, action) => {
    //   const { users, success, message, loading } = action.payload;
    //   // console.log("I am in");
    //   state.value.loading = loading;
    //   state.value.message = message;
    //   state.value.users = users;
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchServiceProviders.fulfilled, (state, action) => {
      state.value.users = action.payload.users;
      state.value.message = action.payload.message;
      state.value.loading = false;
    });
  },
});

export default serviceSlice.reducer;
