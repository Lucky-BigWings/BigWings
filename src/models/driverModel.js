const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true,
        trim: true
    },
    DOB: {
        type: Date,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        // unique: true
    },
    email: {
        type: String,
        required: true,
        // unique: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trum: true
    },
    country: {
        type: String,
        required: true
    },
    driving_license_no: {
        type: String,
        required: true,
        // unique: true
    },
    joining_date: {
        type: Date,
        required: true
    },
    job_type: {
        type: String,
        required: true,
        enum: ["Full-time", "Part-time", "Contract"]
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    // license_exp_date: {
    //     type: Date,
    //     required: true
    // },
    // passport_no: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    // passport_exp_date: {
    //     type: Date,
    //     required: true
    // },
    // TWIC_no: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    // TWIC_exp_date: {
    //     type: Date,
    //     required: true
    // },
    // hazmat_exp_date: {
    //     type: Date,
    //     required: true
    // },
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);