import $api from "../http";

export default class AuthService {
    static async login(username, password) {
        return $api.post('/login', { username, password })
    }

    static async registration(username, password, email) {
        return $api.post('/registration', { username, password, email })
    }

    static async logout() {
        return $api.post('/logout')
    }
}