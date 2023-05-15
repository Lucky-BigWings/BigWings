const mongoose = require('mongoose');

const truckSchema = new mongoose.Schema({
    service_provider: {
        type: String,
        required: true,
        enum: ["Samsara", "No Tracking Device"]
    },
    truck_number: {
        type: String,
        required: true,
        // unique: true,
        trim: true
    },
    model_name: {
        type: String,
        required: true,
        trim: true
    },
    VIN_number: {
        type: String,
        // unique: true,
        trim: true
    },
    License_plate: {
        type: String,
        required: true,
        trim: true
    },
    license_plate_expiry: {
        type: Date,
        required: true
    },
    enroll_date: {
        type: Date
    },
    registration_state: {
        type: String
    },
    gross_weight: {
        type: Number
    },
    condition: {
        type: String,
        enum: ["Best", "Good", "Average", "Bad"]
    },
    assign_driver: {
        type: Boolean
    },
    card_certified: {
        type: Boolean
    },
    active: {
        type: Boolean
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

module.exports = mongoose.model('Truck', truckSchema);