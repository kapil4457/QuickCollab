"use client";

import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import serviceSlice from "./slices/serviceSlice";
import profileSlice from "./slices/profileSlice";
import projectSlice from "./slices/projectSlice";
import jobSlice from "./slices/jobSlice";
import chatSlice from "./slices/chatSlice";
import { TypedUseSelectorHook, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    userSlice,
    serviceSlice,
    profileSlice,
    projectSlice,
    jobSlice,
    chatSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
