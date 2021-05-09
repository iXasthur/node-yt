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

app.use('/api/videos', require('./routes/videos.routes'))
app.use('/api/upload', require('./routes/upload.routes'))

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
                        socket.emit('get_videos_list_result', { videos })
                    } else {
                        socket.emit('auth_result', { error: 'Unable to verify provided jwt' })
                    }
                } else {
                    socket.emit('auth_result', { error: 'Unable to verify provided jwt' })
                }
            })

            socket.on('get_video', async (data) => {
                if (data) {
                    let {videoId, jwt} = data
                    if (verifyJwt(jwt)) {
                        let videos = await Video.find({_id: videoId})
                        socket.emit('get_video_result', { videos })
                    } else {
                        socket.emit('auth_result', { error: 'Unable to verify provided jwt' })
                    }
                } else {
                    socket.emit('auth_result', { error: 'Unable to verify provided jwt' })
                }
            })

            socket.on('delete_video', async (data) => {
                if (data) {
                    let {id, jwt} = data
                    if (verifyJwt(jwt)) {
                        let videos = await Video.findOneAndDelete({_id: id})
                        socket.emit('delete_video_result', { videos })
                    } else {
                        socket.emit('auth_result', { error: 'Unable to verify provided jwt' })
                    }
                } else {
                    socket.emit('auth_result', { error: 'Unable to verify provided jwt' })
                }
            })

            socket.on('video_like', async (data) => {
                if (data) {
                    let {id, jwt} = data
                    let decoded = verifyJwt(jwt)
                    if (decoded) {
                        try {
                            const user = await User.findById(decoded.userId)
                            const video = await Video.findById(id)

                            var likedVideosByUser = user.likedVideoIds
                            var videoLikesCount = video.likes

                            const index = likedVideosByUser.indexOf(id);
                            if (index > -1) {
                                likedVideosByUser.splice(index, 1);
                                videoLikesCount--
                            } else {
                                likedVideosByUser.push(id)
                                videoLikesCount++
                            }

                            await User.findByIdAndUpdate(decoded.userId, {
                                likedVideoIds: likedVideosByUser
                            },  {
                                upsert: true,
                                useFindAndModify: false
                            })


                            await Video.findByIdAndUpdate(id, {
                                likes: videoLikesCount
                            },  {
                                upsert: true,
                                useFindAndModify: false
                            })

                            socket.emit('video_like_result', { likes: videoLikesCount })
                        } catch (e) {
                            socket.emit('video_like_result', { likes: -1 })
                        }
                    } else {
                        socket.emit('auth_result', { error: 'Unable to verify provided jwt' })
                    }
                } else {
                    socket.emit('auth_result', { error: 'Unable to verify provided jwt' })
                }
            })

            socket.on('get_user', async (data) => {
                if (data) {
                    let {jwt} = data
                    let decoded = verifyJwt(jwt)
                    if (decoded) {
                        try {
                            const user = await User.findById(decoded.userId)
                            socket.emit('get_user_result', { user })
                        } catch (e) {
                            socket.emit('auth_result', { error: 'Invalid user id in jwt' })
                        }
                    } else {
                        socket.emit('auth_result', { error: 'Unable to verify provided jwt' })
                    }
                } else {
                    socket.emit('auth_result', { error: 'Unable to verify provided jwt' })
                }
            })

            socket.on('get_uploaded_videos', async (data) => {
                if (data) {
                    let {jwt} = data
                    let decoded = verifyJwt(jwt)
                    if (decoded) {
                        try {
                            const videos = await Video.find({ authorId: decoded.userId })
                            socket.emit('get_uploaded_videos_result', { videos })
                        } catch (e) {
                            socket.emit('auth_result', { error: 'Invalid user id in jwt' })
                        }
                    } else {
                        socket.emit('auth_result', { error: 'Unable to verify provided jwt' })
                    }
                } else {
                    socket.emit('auth_result', { error: 'Unable to verify provided jwt' })
                }
            })

            socket.on('get_liked_videos', async (data) => {
                if (data) {
                    let {jwt} = data
                    let decoded = verifyJwt(jwt)
                    if (decoded) {
                        try {
                            const user = await User.findById(decoded.userId)
                            const ids = user.likedVideoIds

                            const videos = await Video.find({
                                '_id': { $in: ids }
                            })

                            socket.emit('get_liked_videos_result', { videos })
                        } catch (e) {
                            socket.emit('auth_result', { error: 'Invalid user id in jwt' })
                        }
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