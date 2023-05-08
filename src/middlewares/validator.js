const adminModel = require("../models/adminModel");
const userModel = require("../models/adminModel");
const driverModel = require("../models/driverModel");
const mongoose = require('mongoose');

// ====================== Regex for validation ==========================

const isValidObjectId = (ObjectId) => {
    return mongoose.Types.ObjectId.isValid(ObjectId);
  };

const isValidName = (body) => {
    const nameRegex = /^[a-zA-Z_ ]*$/;
    return nameRegex.test(body);
};

// /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/
// /\S+@\S+\.\S+/

const isValidEmail = (body) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(body);
};

const isValidPhone = (body) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(body);
};

const isValidPassword = (body) => {
    const passwordRegex =
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/;
    return passwordRegex.test(body);
};

const isValidDate = (body) => {
    const dateRegex = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;
    return dateRegex.test(body)
};

const isValidLicense = (body) => {
    const licenseRegex = /^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/;
    return licenseRegex.test(body);
};

module.exports = { isValidObjectId, isValidName, isValidEmail, isValidPhone, isValidPassword, isValidDate, isValidLicense };
