import requestHandler from "@/utils/requestHelper";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type chatProps = {
  isGroup: boolean;
  _id: string;
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
      body: string;
      senderId: {
        _id: string;
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
  allknownMembers: {
    knownMembers: null,
    success: null,
    loading: false,
  },
};

export const getConversations = createAsyncThunk(
  "conversation/getConversations",
  async () => {
    const data = await requestHandler(
      {},
      "GET",
      `/api/v1/user/getConversations`
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

export const getKnownMembers = createAsyncThunk(
  "conversation/getKnownMembers",
  async () => {
    const data = await requestHandler(
      {},
      "GET",
      "/api/v1/user/getKnownMembers"
    );
    console.log(data);
    return data;
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
      console.log("currentChat : ", action.payload.conversation);
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
    builder.addCase(getConversations.fulfilled, (state, action) => {
      state.allConversations.conversations = action.payload.conversations;
      state.allConversations.message = "Members fetched successfully.";
      state.allConversations.success = action.payload.success;
    });
    builder.addCase(getConversations.rejected, (state, action) => {
      state.allConversations.conversations = null;
      state.allConversations.message = action.error.message as string;
      state.allConversations.success = false;
    });
    builder.addCase(getConversations.pending, (state, action) => {
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
    builder.addCase(getKnownMembers.fulfilled, (state, action) => {
      state.allknownMembers.knownMembers = action.payload.knownMembers;
      state.allknownMembers.loading = false;
      state.allknownMembers.success = action.payload.success;
    });
    builder.addCase(getKnownMembers.rejected, (state, action) => {
      state.allknownMembers.knownMembers = null;
      state.allknownMembers.loading = false;
      state.allknownMembers.success = false;
    });
    builder.addCase(getKnownMembers.pending, (state, action) => {
      state.allknownMembers.knownMembers = null;
      state.allknownMembers.loading = true;
      state.allknownMembers.success = false;
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
