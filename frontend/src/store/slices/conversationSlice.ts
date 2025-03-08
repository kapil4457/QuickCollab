import { createSlice } from "@reduxjs/toolkit";
import type {
  Dispatch,
  PayloadAction,
  ThunkDispatch,
  UnknownAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { Conversation, MessageDetail } from "../dtos/helper";

// Define a type for the slice state
export interface ConversationState {
  conversations: Conversation[] | null;
  loading: boolean;
}
interface ConversationUpdatePayload {
  conversationId: number;
  messageDetail: MessageDetail;
  lastMessage: Date;
}

export let dispatchType: ThunkDispatch<
  {
    conversation: ConversationState;
  },
  undefined,
  UnknownAction
> &
  Dispatch<UnknownAction>;

// Define the initial state using that type
const initialState: ConversationState = {
  conversations: null,
  loading: false,
};

export const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    updateLocalConversationByConversationId: (
      state,
      action: PayloadAction<ConversationUpdatePayload>
    ) => {
      let conversations = state.conversations;
      conversations?.forEach((conversation) => {
        if (conversation.conversationId === action.payload.conversationId) {
          conversation.messages.push(action.payload.messageDetail);
          conversation.lastMessage = action.payload.lastMessage;
        }
      });
    },
    updateConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
    },
  },
});

export const { updateLocalConversationByConversationId, updateConversations } =
  conversationSlice.actions;

export const selectAllConversations = (state: RootState) => {
  if (state.conversation.conversations) {
    return state.conversation.conversations;
  }
  return [];
};

export default conversationSlice.reducer;
