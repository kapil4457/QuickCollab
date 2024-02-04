import requestHandler from "@/utils/requestHelper";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type useValueProps = {
  isAuthenticated: boolean | null;
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
  updatedUser: {
    success: boolean | null;
    message: string;
  };
  sendQueryEmail: {
    success: boolean | null;
    message: string;
  };
};

const initialState = {
  value: {
    isAuthenticated: null,
    user: null,
    loading: true,
    message: "",
  } as useValueProps,
  availabilityStatus: {
    success: null,
    message: "",
  },
  updatedUser: {
    success: null,
    message: "",
  },
  sendQueryEmail: {
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

export const sendQueryEmail = createAsyncThunk(
  "user/sendQueryEmail",
  async ({ subject, body }: { subject: string; body: string }) => {
    console.log("subject : ", subject);
    console.log("body : ", body);
    const data = await requestHandler(
      {
        subject,
        body,
      },
      "POST",
      "/api/v1/send/query"
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
export const updateUserController = createAsyncThunk(
  "user/updateUser",
  async (info) => {
    const data = await requestHandler(info, "PUT", `/api/v1/me/update`);
    if (data.success) {
      return data;
    }
    return {
      success: data.success,
      message: data.message,
    };
  }
);
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateAvailabilityReset: (state, action) => {
      state.availabilityStatus.success = null;
      state.availabilityStatus.message = "";
    },
    sendQueryEmailReset: (state, action) => {
      state.sendQueryEmail.message = "";
      state.sendQueryEmail.success = null;
    },
    updateUserControllerReset: (state, action) => {
      state.updatedUser.success = null;
      state.updatedUser.message = "";
    },

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

    // update Availability

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

    // Update user details
    builder.addCase(updateUserController.fulfilled, (state, action) => {
      state.updatedUser.success = action.payload.success;
      state.updatedUser.message = action.payload.message;
    });
    builder.addCase(updateUserController.rejected, (state, action) => {
      state.updatedUser.success = false;
      state.updatedUser.message = action.error.message as string;
    });
    builder.addCase(updateUserController.pending, (state, action) => {
      state.updatedUser.success = null;
    });
    // Send Email
    builder.addCase(sendQueryEmail.fulfilled, (state, action) => {
      state.sendQueryEmail.success = action.payload.success;
      state.sendQueryEmail.message = action.payload.message;
    });
    builder.addCase(sendQueryEmail.rejected, (state, action) => {
      state.sendQueryEmail.success = false;
      state.sendQueryEmail.message = action.error.message as string;
    });
    builder.addCase(sendQueryEmail.pending, (state, action) => {
      state.sendQueryEmail.success = null;
    });
  },
});

export default userSlice.reducer;
export const {
  setUserData,
  updateAvailabilityReset,
  sendQueryEmailReset,
  updateUserControllerReset,
} = userSlice.actions;
