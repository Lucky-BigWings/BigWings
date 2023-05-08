const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: [{
        type: Number,
        required: true
    }],
    createdAt: {
        type: Date,
        expires: '1m',
        default: Date.now
    },
}, { timestamps: true });

module.exports = mongoose.model('OTP', otpSchema)