const {Schema, model} = require('mongoose')

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    file_name: {
        type: String,
        required: true
    },
    like_count: {
        type: Number,
        default: 0
    },
    upload_date: {
        type: Date,
        default: Date()
    },
    completed_processing: {
        type: Boolean,
        default: true
    }
})

module.exports = model('video', schema);