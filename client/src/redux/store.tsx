"use client";

import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import serviceSlice from "./slices/serviceSlice";
import { TypedUseSelectorHook, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    userSlice,
    serviceSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
