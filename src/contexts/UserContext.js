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


  useEffect(() => {
    const loadUser = () => {
      try {
        const user = userDataManager.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error loading user:", error);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();

    const handleStorageChange = (e) => {
      if (e.key === "currentUser") {
        loadUser();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = async (email, password) => {
    try {
      const user = userDataManager.loginUser(email, password);
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
  };

  const updateUserInfo = (updatedData) => {
    if (currentUser) {
      try {
        const updatedUser = userDataManager.updateUser(
          currentUser.id,
          updatedData
        );
        setCurrentUser(updatedUser);
        return updatedUser;
      } catch (error) {
        console.error("UserContext - Update failed:", error);
        throw error;
      }
    }
  };

  const refreshUser = () => {
    const user = userDataManager.getCurrentUser();
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
