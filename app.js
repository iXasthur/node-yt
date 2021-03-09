const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');

const app = express()

app.use(cookieParser());
app.use(express.json({ extended: true }))

app.use('/api/auth', require('./routes/auth.rotes'))
app.use('/api/videos', require('./routes/videos.routes'))

const PORT = config.get('port') || 5000

async function start() {
    try {
        let mongoUri = config.get('mongoUri')
        console.log(`Connecting to MongoDB with uri ${mongoUri}`)

        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })

        app.listen(PORT, () => {
            console.log(`App was started on port ${PORT}`)
        })
    } catch (e) {
        console.log(`Server error: ${e.message}`)
        process.exit(1)
    }
}

start()