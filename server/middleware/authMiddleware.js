const tokenService = require('../service/token-service')

module.exports = function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization

        if (!authorizationHeader) {
            return next(res.status(403).json({message: 'Authorization error'}))
        }

        const accessToken = authorizationHeader.split(' ')[1]

        if (!accessToken) {
            return next(res.status(403).json({message: 'Authorization error'}))
        }

        const userData = tokenService.validateAccessToken(accessToken)

        if (!userData) {
            return next(res.status(403).json({message: 'Authorization error'}))
        }

        req.user = userData
        next()
    } catch (e) {
        console.error(e)
        return res.status(403).json({ message: 'Forbidden!'})
    }
}
