class StorageService {
    setToken(token) {
        localStorage.setItem("token", token);
    }

    setRefreshToken(token) {
        localStorage.setItem("refresh_token", token);
    }

    setUser(user) {
        localStorage.setItem("user", JSON.stringify(user));
    }

    getToken() {
        return localStorage.getItem("token");
    }

    getRefreshToken() {
        return localStorage.getItem("refresh_token");
    }

    getUser() {
        const userData = localStorage.getItem("user");
        return userData ? JSON.parse(userData) : null;
    }

    removeToken() {
        localStorage.removeItem("token");
    }

    removeUser() {
        localStorage.removeItem("user");
    }

    clearStorage() {
        localStorage.clear();
    }
}

export default new StorageService();
