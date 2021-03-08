const { Router } = require('express')
const config = require('config')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const router = Router()

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
                    message: "User with such email already exists"
                })
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            const user = new User({
                email,
                hashedPassword
            })

            await user.save()

            res.status(201).json({
                message: "Created new user"
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

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(400).json({
                    message: "Invalid password"
                })
            }

            const token = jwt.sign(
                {userId: user.id},
                config.get('jwtSecret'),
                {expiresIn: '1h'}
            )

            res.json({
                token: token,
                userId: user.id,
            })

        } catch (e) {
            res.status(500).json({
                message: "Something went wrong..."
            })
        }
    }
)

module.exports = router