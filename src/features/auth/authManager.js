import { authApi } from "./authApi";
import { store } from "@/store/store";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

let refreshTimeout = null;

/**
 * Lấy thời gian hết hạn (ms) từ JWT
 */
const getTokenExpiry = (token) => {
    if (!token) return null;
    try {
        const decoded = jwtDecode(token); // { exp: 1756367706, ... }
        return decoded.exp * 1000; // ms
    } catch (e) {
        console.error("[AuthManager] Decode token error:", e);
        return null;
    }
};

/**
 * Lưu token vào cookie, đồng bộ theo exp trong JWT
 */
const setTokenCookie = (token) => {
    try {
        const expiry = getTokenExpiry(token);
        if (!expiry) return;

        const now = Date.now();
        const expiryMs = expiry - now-60000;

        if (expiryMs <= 0) return;

        // convert ms → ngày (js-cookie dùng days)
        const expiresInDays = expiryMs / (1000 * 60 * 60 * 24);

        Cookies.set("token", token, {
            expires: expiresInDays,
            secure: true,
            sameSite: "strict",
        });

        console.log(
            `[AuthManager] Token saved to cookie, expires in ${(expiryMs / 1000 / 60).toFixed(1)} min`
        );
    } catch (e) {
        console.error("[AuthManager] Error setTokenCookie:", e);
    }
};

/**
 * Lên lịch auto refresh token trước khi hết hạn 1 phút
 */
export const scheduleTokenRefresh = (token) => {
    setTokenCookie(token);
    const expiry = getTokenExpiry(token);
    if (!expiry) return;

    const now = Date.now();
    const refreshTime = expiry - now - 60 * 1000; // refresh trước 1 phút

    if (refreshTimeout) clearTimeout(refreshTimeout);

    if (refreshTime > 0) {
        refreshTimeout = setTimeout(() => {
            console.log("[AuthManager] Auto refreshing token...");
            refreshTokenFlow();
        }, refreshTime);
        console.log(
            `[AuthManager] Refresh scheduled in ${(refreshTime / 1000).toFixed(0)}s`
        );
    }
};

/**
 * Hàm gọi refresh token
 */
export const refreshTokenFlow = async () => {
    try {
        const refreshResult = await store.dispatch(
            authApi.endpoints.refreshToken.initiate()
        );

        if (refreshResult.data?.data) {
            const newToken = refreshResult.data.data;
            console.log("[AuthManager] Refresh success, new token:", newToken);

            // Lưu token vào Redux
            store.dispatch({ type: "auth/setToken", payload: newToken });

            // Lưu token vào Cookie
            setTokenCookie(newToken);

            // Lên lịch lại auto refresh
            scheduleTokenRefresh(newToken);

            return newToken;
        } else {
            console.error("[AuthManager] Refresh failed, logging out...");
            logoutFlow();
            return null;
        }
    } catch (err) {
        console.error("[AuthManager] Refresh error:", err);
        logoutFlow();
        return null;
    }
};

/**
 * Logout
 */
export const logoutFlow = () => {
    store.dispatch({ type: "auth/logout" });
    Cookies.remove("token");
    if (refreshTimeout) clearTimeout(refreshTimeout);
    console.log("[AuthManager] Logged out, token cleared");
};
