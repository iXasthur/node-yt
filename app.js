const express = require('express')
const config = require('config')
const mongoose = require('mongoose')

const app = express()

app.use('/api/auth', require('./routes/auth.rotes'))

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