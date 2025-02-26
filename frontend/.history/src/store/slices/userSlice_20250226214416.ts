import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { loginResponseDTO } from "../dtos/response/LoginResponseDTO";
import { loginRequestDTO } from "../dtos/request/loginRequestDTO";

// Define a type for the slice state
interface UserState {
  user: loginResponseDTO;
  jwtToken: string;
}

// Define the initial state using that type
const initialState: UserState = {
  user: {
    message: "",
    success: false,
    user: null,
  },
  jwtToken: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<loginRequestDTO>) => {},
  },
});

export const { loginUser } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectJwtToken = (state: RootState) => state.user.jwtToken;

export default userSlice.reducer;
