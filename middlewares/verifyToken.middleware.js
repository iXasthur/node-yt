const jwt = require('jsonwebtoken')
const config = require('config')

const verifyToken = async (req, res, next) => {
    try {

        const token = req.cookies['jwt']
        if (!token) {
            res.status(401).send({ message: 'Not authorized' })
            return
        }

        const decoded = jwt.verify(token, config.get('jwtSecret'))

        req.user = {
            userId: decoded.userId
        }

        next()
    } catch {
        res.status(401).send({ message: 'Not authorized' })
    }
}

module.exports = verifyToken