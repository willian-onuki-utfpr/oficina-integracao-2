export const authStorage = {
  setToken(token: string) {
    localStorage.setItem("token", token);
  },

  getToken() {
    return localStorage.getItem("token");
  },

  removeToken() {
    localStorage.removeItem("token");
  },

  setUser(user: unknown) {
    localStorage.setItem("usuario", JSON.stringify(user));
  },

  getUser() {
    const user = localStorage.getItem("usuario");

    return user ? JSON.parse(user) : null;
  },

  clear() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  },
};