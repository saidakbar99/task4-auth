const bcrypt = require('bcrypt')
const UserModel = require('../models/user-model')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')

class UserService {

    async generateAndSaveToken(user) {
        const userDto = new UserDto(user)
        const tokens = tokenService.generateAccessToken({ ...userDto })
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto}
    }

    async registration(username, password, email) {
        const candidate = await UserModel.findOne({ username })

        if (candidate) {
            throw new Error(`User with ${username} username already exist`)
        }

        const hashPassword = await bcrypt.hash(password, 3)
        const user = await UserModel.create({ username, password: hashPassword, email })

        return this.generateAndSaveToken(user)
    }

    async login(username, password) {
        const user = await UserModel.findOne({ username })
        const isPassEquals = await bcrypt.compare(password, user.password)

        if (!user || !isPassEquals) {
            throw new Error(`Wrong username/password`)
        }

        await UserModel.findOneAndUpdate({username: username}, {lastLogin: Date.now()})

        return this.generateAndSaveToken(user)
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw new Error('Unauthorized Error')
        }

        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)

        if (!userData || !tokenFromDb) {
            throw new Error('Unauthorized Error')
        }

        const user = await UserModel.findById(userData.id)

        return this.generateAndSaveToken(user)
    }

    async getAllUsers() {
        const users = await UserModel.find()
        return users
    }
}

module.exports = new UserService()