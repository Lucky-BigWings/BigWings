const nodemailer = require('nodemailer');
const otpModel = require('../models/otpModel');
const { isValidEmail } = require('../middlewares/validator');

// ============================ Generate OTP ============================

const generateOTP = async (req, res) => {
    try {
        const data = req.body;

        if (!data.email) {
            return res.status(400).send({ status: false, message: "Please provide email" });
        };

        if (!isValidEmail(data.email)) {
            return res.status(400).send({ status: false, message: "Invalid email" });
        };

        const otp = Math.floor(100000 + Math.random() * 900000);

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'luckybigwings@gmail.com',
                pass: 'zbfsaovhqrklzzes'
            }
        });

        const mailOptions = {
            from: 'luckybigwings@gmail.com',
            to: data.email,
            subject: 'OTP Verification Code',
            text: `Your OTP code is ${otp}. Please enter it to verify your account.`
        };

        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                return res.status(500).send('Error sending OTP email');
            } else {
                const emailExist = await otpModel.findOneAndUpdate({ email: data.email }, { $push: { otp: otp } }, { new: true });
                if (emailExist) {
                    return res.status(201).send({ status: true, message: "OTP sent successfully..." });
                } else {
                    data.otp = otp;
                    const otpGenerated = await otpModel.create(data);
                    return res.status(201).send({ status: true, message: "OTP sent successfully..." });
                };
            };
        });
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    };
};

// ============================= Verify OTP ==============================

const verifyOTP = async (req, res) => {
    try {
        const data = req.body;
        const { email, otp } = data;
        const emailExist = await otpModel.findOne({ email: email });

        if (!emailExist) {
            return res.status(400).send({ status: false, message: "Wrong OTP or OTP is expired.." });
        };

        if (otp !== emailExist.otp[emailExist.otp.length - 1]) {
            return res.status(400).send({ status: false, message: "OTP is incorrect..." });
        } else {
            return res.status(400).send({ status: true, message: "Success" });
        };
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    };
};

module.exports = { generateOTP, verifyOTP };