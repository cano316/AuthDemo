const mongoose = require('mongoose');
const { Schema } = mongoose;

// User Schema

const userSchema = new Schema({
    username: String,
    password: String
})

const User = mongoose.model('User', userSchema);

module.exports = User;