const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
    title: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    authorId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    isProcessing: {
        type: Boolean,
        default: true
    },
    likes: {
        type: Number,
        default: 0
    }
})

module.exports = model('Video', schema)