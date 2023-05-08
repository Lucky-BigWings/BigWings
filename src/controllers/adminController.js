const adminModel = require("../models/adminModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const nodemailer = require('nodemailer');
const { isValidName, isValidEmail, isValidPhone, isValidPassword } = require('../middlewares/validator');

// ============================== Register Admin ===========================

const newAdmin = async (req, res) => {
    try {
        let data = req.body;

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Please provide user details" });
        };

        let { name, email, phone, password } = data;

        if (!name || !email || !phone || !password) {
            return res.status(400).send({ status: false, message: "Please enter all required fields.." });
        };

        if (!isValidName(name)) {
            return res.status(400).send({ status: false, message: "Invalid name" });
        };

        if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "Invalid email" });
        };

        if (!isValidPhone(phone)) {
            return res.status(400).send({ status: false, message: "Invalid phone" });
        };

        if (!isValidPassword(password)) {
            return res.status(400).send({ status: false, message: "Password must have 8 to 15 characters with at least one lowercase, uppercase, numeric value and a special character" });
        };

        const userExist = await adminModel.findOne({ $or: [{ email: email }, { phone: phone }] });

        if (userExist) {
            return res.status(400).send({ status: false, message: "user already exist" });
        };

        const encryptPassword = await bcrypt.hash(data.password, 10);
        data.password = encryptPassword;

        // const otp = Math.floor(100000 + Math.random() * 900000)

        // const transporter = nodemailer.createTransport({
        //     host: 'smtp.gmail.com',
        //     port: 587,
        //     secure: false, // true for 465, false for other ports
        //     auth: {
        //         user: 'luckybigwings@gmail.com',
        //         pass: 'zbfsaovhqrklzzes'
        //     }
        // });

        // const mailOptions = {
        //     from: 'luckybigwings@gmail.com',
        //     to: data.email,
        //     subject: 'OTP Verification Code',
        //     text: `Your OTP code is ${otp}. Please enter it to verify your account.`
        // };

        // transporter.sendMail(mailOptions, async (error, info) => {
        //     if (error) {
        //         console.log('Error sending email:', error);
        //         res.status(500).send('Error sending OTP email');
        //     } else {

        const user = await adminModel.create(data);
        return res.status(201).send({ status: true, message: user });


        // }
        // })

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
};

// ============================== Admin Login ==============================

const adminLogin = async (req, res) => {
    try {
        const data = req.body;
        const { email, password } = data;

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Please provide user details" });
        };

        if (!email || !password) {
            return res.status(400).send({ status: false, message: "Please provide email & password" });
        };

        if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "Invalid email" });
        };

        if (!isValidPassword(password)) {
            return res.status(400).send({ status: false, message: "Password must have 8 to 15 characters with at least one lowercase, uppercase, numeric value and a special character" });
        };

        const userExist = await adminModel.findOne({ email: email });

        if (userExist) {
            const verifyPassword = await bcrypt.compare(password, userExist.password);

            if (!verifyPassword) {
                return res.status(400).send({ status: true, message: "wrong password" });
            };

            const token = jwt.sign(
                {
                    userId: userExist._id,
                },
                "my-secret-key",
                { expiresIn: "9h" }
            );

            return res
                .status(200)
                // .cookie('token', token, { expires: new Date(Date.now() + 86400000) })       // expires in 1 day
                .send({ status: true, message: token });
        } else {
            return res.status(404).send({ status: true, message: "user not found" });
        };

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    };
};

// ====================================== Update Admin =================================

const updateAdmin = async (req, res) => {
    try {
        const adminId = req.params.adminId;
        const data = req.body;
        let { name, phone, email, old_password, password } = data;

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Please provide details" });
        };

        if (name && !isValidName(name)) {
            return res.status(400).send({ status: false, message: "Invalid name" });
        };

        if (phone) {
            if (!isValidPhone(phone)) {
                return res.status(400).send({ status: false, message: "Invalid phone" });
            };
            const phoneExist = await adminModel.findOne({ phone: phone });
            if (phoneExist) {
                return res.status(404).send({ status: false, message: "phone already exist" });
            };
        };

        if (email) {
            return res.status(400).send({ status: false, message: "You can't change your email" });
        };

        if (password) {
            if (!old_password) {
                return res.status(400).send({ status: false, message: "Please enter your old password..." });
            };

            const admin = await adminModel.findById(adminId);
            const verifyPassword = await bcrypt.compare(old_password, admin.password);

            if (!verifyPassword) {
                return res.status(400).send({ status: false, message: "Wrong Password..." });
            };

            if (!isValidPassword(password)) {
                return res.status(400).send({ status: false, message: "Password must have 8 to 15 characters with at least one lowercase, uppercase, numeric value and a special character" });
            };

            const encryptPassword = await bcrypt.hash(password, 10);
            password = encryptPassword;
        };

        const update = await adminModel.findOneAndUpdate({ _id: adminId }, { $set: { name: name, phone: phone, password: password } }, { new: true });

        return res.status(201).send({ status: true, message: update });

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    };
};

// =========================== admin Forgot password =================================

const forgotPassword = async (req, res) => {
    try {
        const email = req.body.email;
        if (!email) {
            return res.status(400).send({ status: false, message: "email is required" });
        };

        if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "Invalid email" });
        };

        const emailExist = await adminModel.findOne({ email: email });
        if (!emailExist) {
            return res.status(400).send({ status: false, message: "admin doesn't exist.." });
        };

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    };
};

// =========================== logOut =======================

const adminLogout = async (req, res) => {
    try {
        return res.status(200).cookie('token', '').send({ status: true, message: "Successfully logged out" });
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    };
};

module.exports = { newAdmin, adminLogin, updateAdmin, forgotPassword, adminLogout };
