export function saveAuth(data, rememberMe = true) {
  const storage = rememberMe ? localStorage : sessionStorage;
  const user = data.user || {};
  const token = data.token;
  const userId = user.id || data.userId || "";
  const email = user.email || data.email || "";
  const role = (user.role || data.role || "patient").toLowerCase();
  const fullName = (user.fullName || user.name || "").trim();

  // Save to target storage
  storage.setItem("token", token);
  storage.setItem("userId", userId);
  storage.setItem("email", email);
  storage.setItem("role", role);
  storage.setItem("fullName", fullName);
  storage.setItem("name", fullName);
  storage.setItem("user", JSON.stringify(user));

  // Also ensure localStorage has consistent identity keys
  localStorage.setItem("role", role);
  if (email) localStorage.setItem("email", email);
  if (fullName) {
    localStorage.setItem("fullName", fullName);
    localStorage.setItem("name", fullName);
  }
}

export function logout() {
  const keys = [
    "token",
    "userId",
    "email",
    "role",
    "fullName",
    "name",
    "user",
  ];

  keys.forEach((k) => {
    localStorage.removeItem(k);
    sessionStorage.removeItem(k);
  });
}

export function isAuthenticated() {
  return !!(localStorage.getItem("token") || sessionStorage.getItem("token"));
}

export function getToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

export function getUserRole() {
  return (
    localStorage.getItem("role") ||
    sessionStorage.getItem("role") ||
    "patient"
  ).toLowerCase();
}

export function getUserEmail() {
  return (
    localStorage.getItem("email") ||
    sessionStorage.getItem("email") ||
    ""
  );
}

export function getUserName() {
  return (
    localStorage.getItem("fullName") ||
    sessionStorage.getItem("fullName") ||
    localStorage.getItem("name") ||
    sessionStorage.getItem("name") ||
    ""
  );
}

export function isDoctor() {
  return getUserRole() === "doctor";
}

export function isPatient() {
  return getUserRole() === "patient";
}

