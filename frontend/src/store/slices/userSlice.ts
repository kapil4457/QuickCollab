import { createSlice } from "@reduxjs/toolkit";
import type {
  Dispatch,
  PayloadAction,
  ThunkDispatch,
  UnknownAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { loggedInUser } from "../dtos/response/LoginResponseDTO";
import { ContentCreatorJobPost } from "../dtos/helper";

// Define a type for the slice state
export interface UserState {
  user: loggedInUser | null;
  jwtToken: string;
  loading: boolean;
}

export let dispatchType: ThunkDispatch<
  {
    user: UserState;
  },
  undefined,
  UnknownAction
> &
  Dispatch<UnknownAction>;

// Define the initial state using that type
const initialState: UserState = {
  user: null,
  jwtToken: "",
  loading: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<UserState>) => {
      state.user = action.payload.user;
      state.loading = action.payload.loading;
      state.jwtToken = action.payload.jwtToken;
    },
    updateUserLoadingState: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    updatePostedJobs: (
      state,
      action: PayloadAction<ContentCreatorJobPost[]>
    ) => {
      if (state.user && "jobsPosted" in state.user) {
        state.user.jobsPosted = action.payload;
      }
    },
  },
});

export const { updateUser, updateUserLoadingState, updatePostedJobs } =
  userSlice.actions;

export const selectJwtToken = (state: RootState) => state.user.jwtToken;
export const selectUserLoadingState = (state: RootState) => state.user.loading;
export const selectLoggedInUser = (state: RootState) => state.user.user;
export const selectPostedJobs = (state: RootState) => {
  if (state.user.user && "jobsPosted" in state.user.user) {
    return state.user.user.jobsPosted;
  }
  return null;
};
export const selectAppliedJobs = (state: RootState) => {
  if (state.user.user && "appliedJobs" in state.user.user) {
    return state.user.user.appliedJobs;
  }
  return null;
};

export const selectAllConversations = (state: RootState) => {
  if (state.user.user && "conversations" in state.user.user) {
    return state.user.user.conversations;
  }
};

export default userSlice.reducer;
