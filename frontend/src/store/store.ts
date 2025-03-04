import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/store/slices/userSlice";
import jobReducer from "@/store/slices/jobSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    job: jobReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
