const tokenService = require('../service/token-service')

module.exports = function (req, res, next) {
    // const AuthError = res.status(403).json({message: 'Authorization error'})

    try {
        const authorizationHeader = req.headers.authorization

        if (!authorizationHeader) {
            return next(res.status(403).json({message: 'Authorization error1'}))
        }

        const accessToken = authorizationHeader.split(' ')[1]

        if (!accessToken) {
            return next(res.status(403).json({message: 'Authorization error2'}))
        }

        const userData = tokenService.validateAccessToken(accessToken)

        if (!userData) {
            return next(res.status(403).json({message: 'Authorization error3'}))
        }

        req.user = userData
        next()
    } catch (e) {
        console.error(e)
        return res.status(403).json({message: 'Authorization error4'})
    }
}
