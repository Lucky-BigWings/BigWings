const driverModel = require('../models/driverModel');
const { isValidObjectId, isValidName, isValidEmail, isValidPhone, isValidDate, isNumber, isString } = require('../middlewares/validator');

// ============================= add Driver ===========================

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

        if (!isValidName(full_name) || !isString(full_name)) {
            return res.status(400).send({ status: false, message: "Invalid full_name" });
        };

        if (!isValidDate(DOB)) {
            return res.status(400).send({ status: false, msg: "DOB must be in 'YYYY-MM-DD' format" });
        };

        if (!isValidPhone(phone) || !isNumber(phone)) {
            return res.status(400).send({ status: false, message: "Invalid phone" });
        };

        if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "Invalid email" });
        };

        if (!isValidDate(joining_date)) {
            return res.status(400).send({ status: false, msg: "joining_date must be in 'YYYY-MM-DD' format" });
        };

        if (!["Full-time", "Part-time", "Contract"].includes(job_type)) {
            return res.status(400).send({ status: false, msg: "Invalid job_type" });
        };

        const driverExist = await driverModel.findOne({ $or: [{ phone: phone }, { email: email }, { driving_license_no: driving_license_no }], isDeleted: false });

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

        if (data.full_name) {
            const regexForName = new RegExp(data.full_name, "i");
            data.full_name = { $regex: regexForName };
        };

        const driverData = await driverModel.find({ $and: [data, { isDeleted: false }] });

        if (driverData.length == 0) {
            return res.status(404).send({ status: false, message: "no data found" });
        }

        return res.status(200).send({ status: true, message: driverData });

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    };
};

// =========================== update Driver =============================

const uodateDriver = async (req, res) => {
    try {
        const driverId = req.params.driverId;

        if (!isValidObjectId(driverId)) {
            return res.status(404).send({ status: false, message: "Invalid driverId" });
        };

        const driver = await driverModel.findById(driverId);
        if (!driver || driver.isDeleted == true) {
            return res.status(404).send({ status: false, msg: "driver doesn't exist.." });
        };

        const data = req.body;
        let { full_name, DOB, phone, email, address, country, driving_license_no, joining_date, job_type } = data;

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Please provide driver details" });
        };

        if (full_name && !isValidName(full_name)) {
            return res.status(400).send({ status: false, message: "Invalid full_name" });
        };

        if (DOB && !isValidDate(DOB)) {
            return res.status(400).send({ status: false, msg: "DOB must be in 'YYYY-MM-DD' format" });
        };

        if (phone) {
            if (!isValidPhone(phone) || !isNumber(phone)) {
                return res.status(400).send({ status: false, message: "Invalid phone" });
            };
        };

        if (email) {
            if (!isValidEmail(email) || !isString(email)) {
                return res.status(400).send({ status: false, message: "Invalid email" });
            };
        };

        if (phone || email || driving_license_no) {
            const driverExist = await driverModel.findOne({ $or: [{ phone: phone }, { email: email }, { driving_license_no: driving_license_no }], isDeleted: false });

            if (driverExist) {
                return res.status(400).send({ status: false, msg: "driver already exist.." });
            };
        };

        if (joining_date && !isValidDate(joining_date)) {
            return res.status(400).send({ status: false, msg: "joining_date must be in 'YYYY-MM-DD' format" });
        };

        if (job_type && !["Full-time", "Part-time", "Contract"].includes(job_type)) return res.status(400).send({ status: false, msg: "Invalid job_type" });

        const update = await driverModel.findOneAndUpdate({ _id: driverId }, { $set: { full_name: full_name, DOB: DOB, phone: phone, email: email, address: address, country: country, driving_license_no: driving_license_no, joining_date: joining_date, job_type: job_type } }, { new: true });

        return res.status(201).send({ status: true, message: update });

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    };
};

// =========================== delete Driver =============================

const deleteDriver = async (req, res) => {
    try {
        const driverId = req.params.driverId;
        if (!isValidObjectId(driverId)) {
            return res.status(400).send({ status: false, message: "Invalid driverId" });
        };

        const driverExist = await driverModel.findById(driverId);
        if (!driverExist || driverExist.isDeleted == true) {
            return res.status(404).send({ status: false, message: "driver doesn't exist" });
        };

        const deleteData = await driverModel.findByIdAndUpdate({ _id: driverId }, { $set: { isDeleted: true, deletedAT: Date.now() } }, { new: true });

        return res.status(200).send({ status: true, message: "data deleted successfully" });

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    };
};

module.exports = { newDriver, fetchDriver, uodateDriver, deleteDriver };