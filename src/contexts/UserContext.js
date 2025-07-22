"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { userDataManager } from "../utils/userDataManager";

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user từ localStorage khi app khởi động
  useEffect(() => {
    const loadUser = () => {
      try {
        const user = userDataManager.getCurrentUser();
        console.log("UserContext - Loaded user:", user);
        setCurrentUser(user);
      } catch (error) {
        console.error("Error loading user:", error);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();

    // Listen for storage changes từ tabs khác
    const handleStorageChange = (e) => {
      if (e.key === "currentUser") {
        console.log("UserContext - Storage changed, reloading user");
        loadUser();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = async (email, password) => {
    try {
      const user = userDataManager.loginUser(email, password);
      console.log("UserContext - Login successful:", user);
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error("UserContext - Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    userDataManager.logoutUser();
    setCurrentUser(null);
    console.log("UserContext - User logged out");
  };

  const updateUserInfo = (updatedData) => {
    if (currentUser) {
      try {
        const updatedUser = userDataManager.updateUser(
          currentUser.id,
          updatedData
        );
        setCurrentUser(updatedUser);
        console.log("UserContext - User updated:", updatedUser);
        return updatedUser;
      } catch (error) {
        console.error("UserContext - Update failed:", error);
        throw error;
      }
    }
  };

  const refreshUser = () => {
    const user = userDataManager.getCurrentUser();
    console.log("UserContext - Refreshed user:", user);
    setCurrentUser(user);
    return user;
  };

  const value = {
    currentUser,
    isLoading,
    login,
    logout,
    updateUserInfo,
    refreshUser,
    isLoggedIn: !!currentUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
