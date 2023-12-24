const { Schema, model } = require('mongoose')

const User = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    createdAt: {type: Date, default: Date.now()},
    lastLogin: {type: Date, default: Date.now()},
    isBlocked: {type: Boolean, default: false},
})

module.exports = model('User', User)