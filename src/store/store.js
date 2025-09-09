import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import { authApi } from "../features/auth/authApi";
import { userApi } from "@/features/userApi";
import { postApi } from "@/features/postApi";
import { mediaApi } from "@/features/mediaApi";
import { postReactionApi } from "@/features/postReactionApi";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [postApi.reducerPath]: postApi.reducer,
        [mediaApi.reducerPath]: mediaApi.reducer,
        [postReactionApi.reducerPath]: postReactionApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware, userApi.middleware, postApi.middleware, mediaApi.middleware, postReactionApi.middleware),
});
