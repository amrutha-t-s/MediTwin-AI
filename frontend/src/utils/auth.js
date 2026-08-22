export function saveAuth(data, rememberMe = true) {
  const storage = rememberMe ? localStorage : sessionStorage;

  storage.setItem("token", data.token);
  storage.setItem("userId", data.user.id);
  storage.setItem("email", data.user.email);
  storage.setItem("role", data.user.role);
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("email");
  localStorage.removeItem("role");

  sessionStorage.removeItem("token");
  sessionStorage.removeItem("userId");
  sessionStorage.removeItem("email");
  sessionStorage.removeItem("role");
}

export function isAuthenticated() {
  return !!(localStorage.getItem("token") || sessionStorage.getItem("token"));
}

export function getUserRole() {
  return localStorage.getItem("role") || sessionStorage.getItem("role");
}

export function getToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}
