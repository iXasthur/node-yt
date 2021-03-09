const { Router } = require('express')
const config = require('config')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middlewares/verifyToken.middleware')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const router = Router()

function createToken(user) {
    return  jwt.sign(
        {userId: user.id},
        config.get('jwtSecret'),
        {expiresIn: '1h'}
    )
}

router.post(
    '/signup',
    [
        check('email', 'Invalid email').isEmail(),
        check('password', 'Minimum password length is 6 symbols').isLength({ min: 6 }),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Invalid sign up data"
                })
            }

            const {email, password} = req.body

            if (await User.findOne({email})) {
                return res.status(400).json({
                    message: "User with that email already exists"
                })
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            const user = new User({
                email,
                hashedPassword
            })

            await user.save()

            const token = createToken(user)

            res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 })
            res.status(201).json({
                message: "Successfully signed up",
            })

        } catch (e) {
            res.status(500).json({
                message: "Something went wrong..."
            })
        }
    }
)

router.post(
    '/signin',
    [
        check('email', 'Invalid email').normalizeEmail().isEmail(),
        check('password', 'Please input password').exists(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Invalid sign in data"
                })
            }

            const {email, password} = req.body

            const user = await User.findOne({email})
            if (!user) {
                return res.status(400).json({
                    message: "User does not exist"
                })
            }

            const isMatch = await bcrypt.compare(password, user.hashedPassword)
            if (!isMatch) {
                return res.status(400).json({
                    message: "Invalid password"
                })
            }

            const token = createToken(user)

            res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 })

            res.json({
                message: "Successfully signed in",
            })

        } catch (e) {
            console.log(e)
            res.status(500).json({
                message: "Something went wrong..."
            })
        }
    }
)

router.post(
    '/signout',
    async (req, res) => {
        try {

            res.cookie('jwt', 'nil', {
                expires: new Date(Date.now()),
                httpOnly: true,
            })
            res.json({
                message: "Successfully signed out",
            })

        } catch (e) {
            console.log(e)
            res.status(500).json({
                message: "Something went wrong..."
            })
        }
    }
)

router.get(
    '/verify',
    verifyToken,
    async (req, res) => {
        try {

            res.json({
                message: "Successfully verified",
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