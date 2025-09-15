import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import { authApi } from "../features/auth/authApi";
import { userApi } from "@/features/userApi";
import { postApi } from "@/features/postApi";
import { mediaApi } from "@/features/mediaApi";
import { postReactionApi } from "@/features/postReactionApi";
<<<<<<< HEAD
import { chatApi } from "@/features/chatApi";
import { friendshipApi } from "@/features/friendshipApi";
=======
>>>>>>> e831905428471ab851098df54886f2b232d48738

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [postApi.reducerPath]: postApi.reducer,
        [mediaApi.reducerPath]: mediaApi.reducer,
        [postReactionApi.reducerPath]: postReactionApi.reducer,
<<<<<<< HEAD
        [chatApi.reducerPath]: chatApi.reducer,
        [friendshipApi.reducerPath]: friendshipApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware, 
            userApi.middleware, 
            postApi.middleware, 
            mediaApi.middleware, 
            postReactionApi.middleware,
            chatApi.middleware,
            friendshipApi.middleware
        ),
=======
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware, userApi.middleware, postApi.middleware, mediaApi.middleware, postReactionApi.middleware),
>>>>>>> e831905428471ab851098df54886f2b232d48738
});
