const mongoose = require('mongoose')
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String},
    age: { type: Number},
    email: { type: String },
    phone: { type: String },
}, {
    timestamps: true
})

module.exports = mongoose.model('user', userSchema)