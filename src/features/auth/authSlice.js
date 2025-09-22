import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";


const initialState = {
    token: null, // chỉ lưu trong redux (memory)
    isAuthenticated: false
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { token } = action.payload;
            state.token = token;
            state.isAuthenticated = true;
        },
        clearCredentials: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem("profile");
        },
    },
});

export const { setCredentials, clearCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
