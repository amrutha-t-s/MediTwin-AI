export function saveAuth(data, rememberMe = true) {
  const storage = rememberMe ? localStorage : sessionStorage;

  storage.setItem("token", data.token);
  storage.setItem("userId", data.user?.id || data.userId);
  storage.setItem("email", data.user?.email || data.email);
  storage.setItem("role", data.user?.role || data.role);
}

export function logout() {
  // Clear localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("email");
  localStorage.removeItem("role");

  // Clear sessionStorage
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("userId");
  sessionStorage.removeItem("email");
  sessionStorage.removeItem("role");
}

export function isAuthenticated() {
  return !!(localStorage.getItem("token") || sessionStorage.getItem("token"));
}

export function getToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}
