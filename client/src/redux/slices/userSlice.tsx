import requestHandler from "@/utils/requestHelper";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type useValueProps = {
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
  message: string;
};
type initialStateProps = {
  value: useValueProps;
  availabilityStatus: {
    success: boolean | null;
    message: string;
  };
};

const initialState = {
  value: {
    isAuthenticated: false,
    user: null,
    loading: true,
    message: "",
  } as useValueProps,
  availabilityStatus: {
    success: null,
    message: "",
  },
} as initialStateProps;

export const updateAvailability = createAsyncThunk(
  "/user/updateAvailability",
  async (status) => {
    const data = await requestHandler(
      status,
      "PUT",
      "/api/v1/me/update/availability"
    );
    if (data.success) {
      return data;
    }
    return {
      success: data.success,
      message: data.message,
    };
  }
);

export const fetchMe = createAsyncThunk("user/fetchMe", async () => {
  const data = await requestHandler({}, "GET", `/api/v1/me/`);

  if (data.success) {
    return data;
  }
  return {
    success: data.success,
    message: data.message,
  };
});
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
  extraReducers(builder) {
    builder.addCase(fetchMe.fulfilled, (state, action) => {
      state.value.message = action.payload.message;
      state.value.loading = false;
      state.value.user = action.payload.user;
    });
    builder.addCase(fetchMe.rejected, (state, action) => {
      state.value.message = action.error.message as string;
      state.value.loading = false;
    });
    builder.addCase(fetchMe.pending, (state, action) => {
      state.value.loading = true;
      state.value.message = "Fetching your details";
    });

    builder.addCase(updateAvailability.fulfilled, (state, action) => {
      state.availabilityStatus.success = action.payload.success;
      state.availabilityStatus.message = action.payload.message;
    });
    builder.addCase(updateAvailability.rejected, (state, action) => {
      state.availabilityStatus.success = false;
      state.availabilityStatus.message = action.error.message as string;
    });
    builder.addCase(updateAvailability.pending, (state, action) => {
      state.availabilityStatus.success = null;
    });
  },
});

export default userSlice.reducer;
export const { setUserData } = userSlice.actions;
