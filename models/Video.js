const { Schema, model } = require('mongoose')

const schema = new Schema({
    localFilePath: {
        type: String,
        required: true,
        unique: true
    }
})

module.exports = model('Video', schema)