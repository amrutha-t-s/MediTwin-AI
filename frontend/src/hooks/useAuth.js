import { useState } from "react";

function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token") || !!sessionStorage.getItem("token"),
  );

  const login = (data, rememberMe = false) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    const user = data.user || {};
    const role = (user.role || data.role || "patient").toLowerCase();
    const fullName = (user.fullName || user.name || "").trim();

    storage.setItem("token", data.token);
    storage.setItem("userId", user.id || data.userId || "");
    storage.setItem("email", user.email || data.email || "");
    storage.setItem("role", role);
    storage.setItem("fullName", fullName);
    storage.setItem("name", fullName);
    storage.setItem("user", JSON.stringify(user));

    localStorage.setItem("role", role);
    if (user.email) localStorage.setItem("email", user.email);
    if (fullName) {
      localStorage.setItem("fullName", fullName);
      localStorage.setItem("name", fullName);
    }

    setIsLoggedIn(true);
  };

  const logout = () => {
    const keys = ["token", "userId", "email", "role", "fullName", "name", "user"];
    keys.forEach((k) => {
      localStorage.removeItem(k);
      sessionStorage.removeItem(k);
    });

    setIsLoggedIn(false);
  };

  return {
    isLoggedIn,
    login,
    logout,
  };
}

export default useAuth;
