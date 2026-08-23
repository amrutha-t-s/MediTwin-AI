import { useState } from "react";

function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token") || !!sessionStorage.getItem("token"),
  );

  const login = (data, rememberMe = false) => {
    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem("token", data.token);
    storage.setItem("userId", data.user.id);
    storage.setItem("email", data.user.email);
    storage.setItem("role", data.user.role);

    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("role");

    setIsLoggedIn(false);
  };

  return {
    isLoggedIn,
    login,
    logout,
  };
}

export default useAuth;
