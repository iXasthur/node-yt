const express = require('express')
const socket = require('socket.io')
const config = require('config')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const User = require('./models/User')
const Video = require('./models/Video')
const bcrypt = require('bcryptjs')

const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken');

app.use(cors())
app.use(cookieParser());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const PORT = config.get('port') || 5000

function createToken(user) {
    return  jwt.sign(
        {userId: user.id},
        config.get('jwtSecret'),
        {expiresIn: '1h'}
    )
}

function verifyJwt(token) {
    try {
        if (!token) {
            return null
        }
        return jwt.verify(token, config.get('jwtSecret'))
    } catch {
        return null
    }
}

async function start() {
    try {
        let mongoUri = config.get('mongoUri')
        console.log(`Connecting to MongoDB with uri ${mongoUri}`)

        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })

        const server = app.listen(PORT, () => {
            console.log(`App was started on port ${PORT}`)
        })

        const io = socket(server)
        io.on('connection', (socket) => {
            console.log('User connected with id = ' + socket.id)

            socket.on('restore_auth', (data) => {
                if (data) {
                    let {jwt} = data
                    if (verifyJwt(jwt)) {
                        socket.emit('auth_result', { jwt })
                    } else {
                        socket.emit('auth_result', { error: 'Unable to verify provided jwt' })
                    }
                } else {
                    socket.emit('auth_result', { error: 'Unable to verify provided jwt' })
                }
            })

            socket.on('sign_up', async (data) => {
                const {email, password} = data

                if (await User.findOne({email})) {
                    socket.emit('auth_result', { error: 'User with that email already exists' })
                    return
                }

                const hashedPassword = await bcrypt.hash(password, 12)
                const user = new User({
                    email,
                    hashedPassword
                })

                await user.save()

                const jwt = createToken(user)

                socket.emit('auth_result', { jwt })
            })

            socket.on('sign_in', async (data) => {
                const {email, password} = data

                const user = await User.findOne({email})
                if (!user) {
                    socket.emit('auth_result', { error: "User does not exist" })
                    return
                }

                const isMatch = await bcrypt.compare(password, user.hashedPassword)
                if (!isMatch) {
                    socket.emit('auth_result', { error: "Invalid password" })
                    return
                }

                const jwt = createToken(user)

                socket.emit('auth_result', { jwt })
            })

            socket.on('get_videos_list', async (data) => {
                if (data) {
                    let {jwt} = data
                    if (verifyJwt(jwt)) {
                        let videos = await Video.find({})
                        console.log(videos)
                        socket.emit('get_videos_list_result', { videos })
                    } else {
                        socket.emit('auth_result', { error: 'Unable to verify provided jwt' })
                    }
                } else {
                    socket.emit('auth_result', { error: 'Unable to verify provided jwt' })
                }
            })

            socket.on('disconnect', async () => {
                console.log('User disconnected with id = ' + socket.id)
            })
        })
    } catch (e) {
        console.log(`Server error: ${e.message}`)
        process.exit(1)
    }
}

start()