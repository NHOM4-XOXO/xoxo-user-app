import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

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
      state.profile = profile; // lưu cả object profile
      state.token = token;
      state.isAuthenticated = true;

      localStorage.setItem(
        "auth",
        JSON.stringify({
          profile,
          isAuthenticated: true,
        })
      );
    },
    clearCredentials: (state) => {
      state.profile = null;
      state.token = null;
      state.isAuthenticated = false; 
    },
    logout: (state) => {
      state.profile = null; 
      state.token = null;
      state.isAuthenticated = false;

      if (typeof window !== "undefined") {
        Cookies.remove("token");
         Cookies.remove("token", { path: "/" });
        localStorage.removeItem("auth");
      }
    },
  },
});

export const { setCredentials, clearCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
