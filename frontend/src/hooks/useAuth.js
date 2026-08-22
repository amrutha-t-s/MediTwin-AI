import { useState } from "react";
import { saveAuth, logout as clearAuth, isAuthenticated } from "../utils/auth";

function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

  const login = (data, rememberMe = true) => {
    saveAuth(data, rememberMe);
    setIsLoggedIn(true);
  };

  const logout = () => {
    clearAuth();
    setIsLoggedIn(false);
  };

  return {
    isLoggedIn,
    login,
    logout,
  };
}

export default useAuth;
