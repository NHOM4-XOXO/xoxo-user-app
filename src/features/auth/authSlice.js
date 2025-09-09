import { createSlice } from "@reduxjs/toolkit";

const savedAuth = typeof window !== "undefined" ? localStorage.getItem("auth") : null;

const initialState = savedAuth
    ? JSON.parse(savedAuth)
    : {
        profile: null,
        isAuthenticated: false,
    };

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { profile, token } = action.payload;
            state.profile = profile;   // lưu cả object profile
            state.token = token;
            state.isAuthenticated = true;

            localStorage.setItem("auth", JSON.stringify({
                profile, isAuthenticated: true
            }));
        },
        clearCredentials: (state) => {
            state.profile = null;
            state.token = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
