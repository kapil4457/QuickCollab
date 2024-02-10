import requestHandler from "@/utils/requestHelper";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type sendMessageProps = {
  success: boolean | null;
  loading: boolean | null;
};
const initialState = {
  sendMessage: {
    success: null,
    loading: null,
  } as sendMessageProps,
};
export const sendMessage = createAsyncThunk(
  "message/sendMessage",
  async (info) => {
    const data = await requestHandler(
      info,
      "POST",
      `/api/v1/conversation/create/message`
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

export const messageSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    sendMessageReset: (state, action) => {
      state.sendMessage.success = null;
      state.sendMessage.loading = null;
    },
  },

  extraReducers: (builder) => {
    // get all contacts
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      state.sendMessage.success = action.payload.success;
      state.sendMessage.loading = false;
    });
    builder.addCase(sendMessage.rejected, (state, action) => {
      state.sendMessage.success = false;
      state.sendMessage.loading = false;
    });
    builder.addCase(sendMessage.pending, (state, action) => {
      state.sendMessage.success = null;
      state.sendMessage.loading = true;
    });
  },
});

export default messageSlice.reducer;
export const { sendMessageReset } = messageSlice.actions;
