const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
    {
        first_name: { type: String, default: null },
        last_name: { type: String, default: null },
        email: { type: String, unique: true },
        password: { type: String, required: true },
        token: { type: String }
    }
)

const User = mongoose.model('User', userSchema)

module.exports = User;