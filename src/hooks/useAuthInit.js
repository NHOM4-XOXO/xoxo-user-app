import { useRefreshTokenMutation } from "@/features/auth/authApi";
import { clearCredentials, setCredentials } from "@/features/auth/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";



export function useAuthInit() {
    const dispatch = useDispatch();
    const [refreshToken] = useRefreshTokenMutation();

    useEffect(() => {
        const initAuth = async () => {
            try {
                const storedProfile = localStorage.getItem("profile");
                if (storedProfile) {
                    dispatch(setCredentials(JSON.parse(storedProfile)));
                }

                // luôn thử refresh khi app mở
                const res = await refreshToken().unwrap();
                if (res?.data) {
                    dispatch(setCredentials({
                        token: res.data,
                        profile: null,
                    }));
                }



            } catch (err) {
                console.warn("Auth init failed, logging out:", err);
                dispatch(clearCredentials());
                localStorage.removeItem("profile");
            }
        };

        initAuth();
    }, [dispatch, refreshToken]);
}
