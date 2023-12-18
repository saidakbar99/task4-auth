const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    if (req.status === 'OPTIONS') {
        next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1]

        if (!token) {
            return res.status(403).json({ message: 'Forbidden: Access denied'})
        }

        const decodedData = jwt.verify(token, process.env.SECRET_KEY)
        req.user = decodedData
        next()
    } catch (e) {
        console.error(e)
        return res.status(403).json({ message: 'Forbidden123'})
    }
}