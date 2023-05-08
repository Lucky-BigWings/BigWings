const driverModel = require('../models/driverModel');
const { isValidName, isValidEmail, isValidPhone, isValidDate } = require('../middlewares/validator');

const newDriver = async (req, res) => {
    try {
        const data = req.body;
        const { full_name, DOB, phone, email, address, country, driving_license_no, joining_date, job_type } = data;

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Please provide driver details" });
        };

        if (!full_name || !DOB || !phone || !email || !address || !country || !driving_license_no || !joining_date || !job_type) {
            return res.status(400).send({ status: false, message: "Please enter all required fields.." });
        };

        if (!isValidName(full_name)) {
            return res.status(400).send({ status: false, message: "Invalid full_name" });
        };

        if (!isValidDate(DOB)) {
            return res.status(400).send({ status: false, msg: "DOB must be in 'YYYY-MM-DD' format" });
        };

        if (!isValidPhone(phone)) {
            return res.status(400).send({ status: false, message: "Invalid phone" });
        };

        if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "Invalid email" });
        };

        if (!isValidDate(joining_date)) {
            return res.status(400).send({ status: false, msg: "joining_date must be in 'YYYY-MM-DD' format" });
        };

        if (!["Full-time", "Part-time", "Contract"].includes(job_type)) return res.status(400).send({ status: false, msg: "Invalid job_type" });

        const driverExist = await driverModel.findOne({ $or: [{ phone: phone }, { email: email }, { driving_license_no: driving_license_no }] });

        if (driverExist) {
            return res.status(400).send({ status: false, message: "driver already exist" });
        };

        const driverCreated = await driverModel.create(data);
        return res.status(201).send({ status: true, message: driverCreated });

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    };
};

// =========================== fetch Driver =============================

const fetchDriver = async (req, res) => {
    try {
        const data = req.query;
        const { full_name, country } = data;
        const driverData = await driverModel.find(data);

        if (driverData.length == 0) {
            return res.status(404).send({ status: false, message: driverData });
        }

        return res.status(200).send({ status: true, message: driverData });

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    };
};

module.exports = { newDriver, fetchDriver };