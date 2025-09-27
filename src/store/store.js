import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import { authApi } from "../features/auth/authApi";
import { userApi } from "@/features/userApi";
import { postApi } from "@/features/postApi";
import { mediaApi } from "@/features/mediaApi";
import { postReactionApi } from "@/features/postReactionApi";
import { chatApi } from "@/features/chatApi";
import { friendshipApi } from "@/features/friendshipApi";
import { groupApi } from "@/features/groupManageMentApi";
import { reportsApi } from "@/features/reportApi";
import { newsfeedApi } from "@/features/newsfeedApi";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [postApi.reducerPath]: postApi.reducer,
    [mediaApi.reducerPath]: mediaApi.reducer,
    [postReactionApi.reducerPath]: postReactionApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [friendshipApi.reducerPath]: friendshipApi.reducer,
    [groupApi.reducerPath]: groupApi.reducer,
    [reportsApi.reducerPath]: reportsApi.reducer,
    [newsfeedApi.reducerPath]: newsfeedApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      postApi.middleware,
      mediaApi.middleware,
      postReactionApi.middleware,
      chatApi.middleware,
      friendshipApi.middleware,
      groupApi.middleware,
      reportsApi.middleware,
      newsfeedApi.middleware,
    ),
});
