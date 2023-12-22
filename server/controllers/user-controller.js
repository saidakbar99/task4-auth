const userService = require('../service/user-service')
const { validationResult } = require('express-validator')

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return console.error('Validation Error: ', errors)
            }

            const { username, password, email } = req.body
            const userData = await userService.registration(username, password, email)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const { username, password } = req.body
            const userData = await userService.login(username, password)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch (e) {
            next(e)
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies
            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async blockUser (req, res) {
        try {
            const selectedIds = req.body.selectedIds
            const result = await User.updateMany({ _id: { $in: selectedIds } }, {"$set":{"status": "BLOCKED"}})
            return res.json({ message: 'Users status updated', result })
        } catch (e) {
            console.error(e)
        }
    }

    async unblockUser (req, res) {
        try {
            const selectedIds = req.body.selectedIds
            const result = await User.updateMany({ _id: { $in: selectedIds } }, {"$set":{"status": "ACTIVE"}})
            return res.json({ message: 'Users status updated', result })
        } catch (e) {
            console.error(e)
        }
    }

    async deleteUser (req, res) {
        try {
            const selectedIds = req.body.selectedIds
            const result = await User.deleteMany({ _id: { $in: selectedIds } })
            return res.json({ message: 'Users deleted successfully', result })
        } catch (e) {
            console.error(e)
            res.status(500).json({message: 'error'})
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers()
            return res.json(users)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new UserController()