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



    } catch (e) {
        console.log(`Server error: ${e.message}`)
        process.exit(1)
    }
}

start()