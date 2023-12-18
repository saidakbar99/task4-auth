const Router = require('express')
const router = new Router()
const { check } = require('express-validator')
const controller = require('./authController')
const authMiddleware = require('./middleware/authMiddleware')

//! REFACTOR
router.post('/sign_up', [
    check('username', 'Username cannot be empty').notEmpty(),
    check('password', 'Password cannot be empty').notEmpty(),
    check('email', 'Email cannot be empty').notEmpty(),
], controller.sign_up)
router.post('/sign_in', controller.sign_in)
router.get('/', authMiddleware, controller.getUsers)
router.post('/', controller.deleteUser)
router.post('/block', controller.blockUser)
router.post('/unblock', controller.unblockUser)

module.exports = router