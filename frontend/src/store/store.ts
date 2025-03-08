import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/store/slices/userSlice";
import jobReducer from "@/store/slices/jobSlice";
import conversationReducer from "@/store/slices/conversationSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    job: jobReducer,
    conversation: conversationReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
