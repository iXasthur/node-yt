const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    likedVideoIds: [{
        type: Types.ObjectId,
        ref: 'Video'
    }]
})

module.exports = model('User', schema)