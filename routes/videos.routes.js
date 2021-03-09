const { Router } = require('express')
const verifyToken = require('../middlewares/verifyToken.middleware')
const router = Router()

router.get(
    '/',
    verifyToken,
    async (req, res) => {
        try {

            res.json({
                message: '/list!!!'
            })

        } catch (e) {
            console.log(e)
            res.status(500).json({
                message: "Something went wrong..."
            })
        }
    }
)

module.exports = router