import requestHandler from "@/utils/requestHelper";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type chatProps = {
  isGroup: boolean;
  groupAdmin: {
    _id: string;
    name: string;
    avatar: {
      _id: string;
      url: string;
    };
  };
  name: string;
  lastMessageAt: string;
  createdAt: string;
  groupLogo: {
    _id: string;
    url: string;
  };
  members: [];
  messages: [
    {
      message: string;
      sender: {
        name: string;
        avatar: {
          _id: string;
          url: string;
        };
      };
    }
  ];
};
type currentChat = {
  chat: chatProps | null;
};
const initialState = {
  currentChat: {
    chat: null,
  } as currentChat,
  allConversations: {
    conversations: null,
    success: null,
    message: "",
  },
  createConversation: {
    loading: false,
    success: null,
    message: "",
  },
};

export const getKnownMembers = createAsyncThunk(
  "conversation/getContacts",
  async () => {
    const data = await requestHandler({}, "GET", `/api/v1/user/getContacts`);
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

export const createConversation = createAsyncThunk(
  "conversation/createConversation",
  async (info) => {
    const data = await requestHandler(
      info,
      "POST",
      `/api/v1/user/create/conversation`
    );
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

export const conversationSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    setCurrentChat: (state, action) => {
      console.log(action.payload);
      state.currentChat.chat = action.payload.conversation;
    },
    createConversationReset: (state, action) => {
      state.createConversation.message = "";
      state.createConversation.success = null;
      state.createConversation.loading = false;
    },
  },
  extraReducers: (builder) => {
    // get all contacts
    builder.addCase(getKnownMembers.fulfilled, (state, action) => {
      state.allConversations.conversations = action.payload.conversations;
      state.allConversations.message = "Members fetched successfully.";
      state.allConversations.success = action.payload.success;
    });
    builder.addCase(getKnownMembers.rejected, (state, action) => {
      state.allConversations.conversations = null;
      state.allConversations.message = action.error.message as string;
      state.allConversations.success = false;
    });
    builder.addCase(getKnownMembers.pending, (state, action) => {
      state.allConversations.conversations = null;
      state.allConversations.message = "Fetching members";
      state.allConversations.success = null;
    });
    // initilize a new conversation
    builder.addCase(createConversation.fulfilled, (state, action) => {
      state.createConversation.loading = false;
      state.createConversation.message = action.payload.message;
      state.createConversation.success = action.payload.success;
    });
    builder.addCase(createConversation.rejected, (state, action) => {
      state.createConversation.loading = false;
      state.createConversation.message = action.error.message;
      state.createConversation.success = action.payload.success;
    });
    builder.addCase(createConversation.pending, (state, action) => {
      state.createConversation.loading = true;
      state.createConversation.message = "";
      state.createConversation.success = null;
    });
    // delete a group
    // leave a group
    // update the group details
    // add members to the group
    // remove members from a group
  },
});

export default conversationSlice.reducer;
export const { setCurrentChat, createConversationReset } =
  conversationSlice.actions;
