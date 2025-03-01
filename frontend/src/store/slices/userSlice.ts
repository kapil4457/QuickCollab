import { createSlice } from "@reduxjs/toolkit";
import type {
  Dispatch,
  PayloadAction,
  ThunkDispatch,
  UnknownAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { loggedInUser } from "../dtos/response/LoginResponseDTO";

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
  },
});

export const { updateUser, updateUserLoadingState } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectJwtToken = (state: RootState) => state.user.jwtToken;
export const selectUserLoadingState = (state: RootState) => state.user.loading;
export const selectLoggedInUser = (state: RootState) => state.user.user;

export default userSlice.reducer;
