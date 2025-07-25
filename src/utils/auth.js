export function setToken(token) {
  localStorage.setItem('atm_token', token);
}

export function getToken() {
  return localStorage.getItem('atm_token');
}

export function removeToken() {
  localStorage.removeItem('atm_token');
}

export function isLoggedIn() {
  return !!getToken();
}
