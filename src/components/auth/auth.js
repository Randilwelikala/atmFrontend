// src/auth.js
export function isLoggedIn() {
  const session = sessionStorage.getItem("userSession");
  if (!session) return false;
  try {
    const parsed = JSON.parse(session);
    return parsed?.isLoggedIn;
  } catch {
    return false;
  }
}

export function logout() {
  sessionStorage.removeItem("userSession");
  window.location.href = "/";
}
