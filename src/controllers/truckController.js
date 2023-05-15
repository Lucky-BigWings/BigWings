const truckModel = require('../models/truckModel');
const { isValidObjectId, isString, isNumber, isValidTruckNumber, isValidVIN, isValidDate, isValidWeight, isBoolean } = require('../middlewares/validator');

// ============================= add Truck ===========================

const newTruck = async (req, res) => {
    try {
        const data = req.body;
        const { service_provider, truck_number, model_name, VIN_number, License_plate, license_plate_expiry, enroll_date, registration_state, gross_weight, condition, assign_driver, card_certified, active } = data;

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Please provide driver details" });
        };

        if (!service_provider || !truck_number || !model_name || !License_plate || !license_plate_expiry) {
            return res.status(400).send({ status: false, message: "Please enter all required fields.." });
        };

        if (!["Samsara", "No Tracking Device"].includes(service_provider)) {
            return res.status(400).send({ status: false, message: "Invalid service_provider" });
        };

        // if (!isValidTruckNumber(truck_number)) {
        //     return res.status(400).send({ status: false, msg: "Invalid truck_number" });
        // };

        if (!isString(model_name)) {
            return res.status(400).send({ status: false, msg: "Invalid model_name" });
        }

        // if (!isValidVIN(VIN_number)) {
        //     return res.status(400).send({ status: false, message: "Invalid VIN_number" });
        // };

        if (!isValidDate(license_plate_expiry) || !isValidDate(enroll_date)) {
            return res.status(400).send({ status: false, message: "date must be in 'YYYY-MM-DD' format" });
        };

        if (!isValidWeight(gross_weight)) {
            return res.status(400).send({ status: false, msg: "Invalid gross_weight" });
        };

        if (!["Best", "Good", "Average", "Bad"].includes(condition)) {
            return res.status(400).send({ status: false, message: "Invalid condition" });
        };

        if (!isBoolean(assign_driver)) {
            return res.status(400).send({ status: false, message: "assign_driver must be boolean type" });
        };

        if (!isBoolean(card_certified)) {
            return res.status(400).send({ status: false, message: "card_certified must be boolean type" });
        };

        if (!isBoolean(active)) {
            return res.status(400).send({ status: false, message: "active must be boolean type" });
        };

        const truckExist = await truckModel.findOne({ $or: [{ truck_number: truck_number }, { VIN_number: VIN_number }], isDeleted: false });

        if (truckExist) {
            return res.status(400).send({ status: false, message: "truck already exist" });
        };

        const truckCreated = await truckModel.create(data);
        return res.status(201).send({ status: true, message: truckCreated });

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    };
};

// ========================= fetch Truck ==============================

const fetchTruck = async (req, res) => {
    try {
        const data = req.query;

        const truckData = await truckModel.find(data);

        if (truckData.length == 0) {
            return res.status(400).send({ status: false, message: "no data found" });
        };

        return res.status(200).send({ status: true, message: truckData });
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    };
};

// ========================= update Truck ==============================

const updateTruck = async (req, res) => {
    try {
        const truckId = req.params.truckId;

        if (!isValidObjectId(truckId)) {
            return res.status(404).send({ status: false, message: "Invalid truckId" });
        };

        const truck = await truckModel.findById(truckId);
        if (!truck || truck.isDeleted == true) {
            return res.status(404).send({ status: false, msg: "truck doesn't exist.." });
        };

        const data = req.body;
        let { service_provider, truck_number, model_name, VIN_number, License_plate, license_plate_expiry, enroll_date, registration_state, gross_weight, condition, assign_driver, card_certified, active } = data;

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Please provide truck details" });
        };

        if (service_provider && !["Samsara", "No Tracking Device"].includes(service_provider)) {
            return res.status(400).send({ status: false, message: "Invalid service_provider" });
        };

        // if (truck_number && !isValidTruckNumber(truck_number)) {
        //     return res.status(400).send({ status: false, msg: "Invalid truck_number" });
        // };

        if (model_name && !isString(model_name)) {
            return res.status(400).send({ status: false, msg: "Invalid model_name" });
        };

        // if (VIN_number && !isValidVIN(VIN_number)) {
        //     return res.status(400).send({ status: false, message: "Invalid VIN_number" });
        // };

        if (license_plate_expiry || enroll_date) {
            if (!isValidDate(license_plate_expiry) || !isValidDate(enroll_date)) {
                return res.status(400).send({ status: false, message: "date must be in 'YYYY-MM-DD' format" });
            };
        };

        if (gross_weight && !isValidWeight(gross_weight)) {
            return res.status(400).send({ status: false, msg: "Invalid gross_weight" });
        };

        if (condition && !["Best", "Good", "Average", "Bad"].includes(condition)) {
            return res.status(400).send({ status: false, message: "Invalid condition" });
        };

        if (assign_driver && !isBoolean(assign_driver)) {
            return res.status(400).send({ status: false, message: "assign_driver must be boolean type" });
        };

        if (card_certified && !isBoolean(card_certified)) {
            return res.status(400).send({ status: false, message: "card_certified must be boolean type" });
        };

        if (active && !isBoolean(active)) {
            return res.status(400).send({ status: false, message: "active must be boolean type" });
        };

        if (truck_number || VIN_number) {
            const truckExist = await truckModel.findOne({ $or: [{ truck_number: truck_number }, { VIN_number: VIN_number }], isDeleted: false });

            if (truckExist) {
                return res.status(400).send({ status: false, msg: "truck already exist.." });
            };
        };

        const update = await truckModel.findOneAndUpdate({ _id: truckId }, { $set: { service_provider: service_provider, truck_number: truck_number, model_name: model_name, VIN_number: VIN_number, License_plate: License_plate, license_plate_expiry: license_plate_expiry, enroll_date: enroll_date, registration_state: registration_state, gross_weight: gross_weight, condition: condition, assign_driver: assign_driver, card_certified: card_certified, active: active } }, { new: true });

        return res.status(200).send({ status: true, message: update });

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    };
};

// ========================= update Truck ==============================

const deleteTruck = async (req, res) => {
    try {
        const truckId = req.params.truckId;
        if (!isValidObjectId(truckId)) {
            return res.status(400).send({ status: false, message: "Invalid truckId" });
        };

        const truckExist = await truckModel.findById(truckId);
        if (!truckExist || truckExist.isDeleted == true) {
            return res.status(404).send({ status: false, message: "truck doesn't exist" });
        };

        const daleteData = await truckModel.findByIdAndUpdate({ _id: truckId }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true });

        return res.status(200).send({ status: true, message: "data deleted successfully" });

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    };
};

module.exports = { newTruck, fetchTruck, updateTruck, deleteTruck };