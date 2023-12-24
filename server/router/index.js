const Router = require('express').Router
const router = new Router()
const userController = require('../controllers/user-controller')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.post('/delete', userController.deleteUser)
router.post('/block', userController.blockUser)
router.post('/unblock', userController.unblockUser)
router.get('/users', authMiddleware, userController.getUsers)
router.get('/refresh', userController.refresh)

module.exports = router