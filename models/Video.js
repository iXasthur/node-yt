const { Schema, model } = require('mongoose')

const schema = new Schema({
    title: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    }
})

module.exports = model('Video', schema)