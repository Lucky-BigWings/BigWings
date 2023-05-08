const jwt = require("jsonwebtoken");
const adminModel = require("../models/adminModel");
const ObjectId = require('mongoose').Types.ObjectId;

// ======================== admin Authentication ============================

const adminAuthentication = async (req, res, next) => {
    try {
        // let token = req.cookies;
        let token = req.headers.authorization;
        if (!token) {
            return res.status(401).send({ status: false, message: "token must be present" });
        };

        // token = token.replace(/^Bearer\s+/, "");
        token = token.split(' ')[1];

        jwt.verify(token, "my-secret-key", (error, validToken) => {
            if (error) {
                return res.status(401).send({ status: false, message: error.message });
            } else {
                req.validToken = validToken;
                next();
            };
        });
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    };
};

// ======================== admin Authorization ============================

const adminAuthorization = async (req, res, next) => {
    try {
        const adminId = req.params.adminId
        if (!ObjectId.isValid(adminId)) {
            return res.status(400).send({ status: false, message: "Invalid adminId" })
        };

        const adminExist = await adminModel.findById(adminId);
        if (!adminExist) {
            return res.status(400).send({ status: false, message: "admin doesn't exist" });
        };

        const loggedInAdmin = req.validToken.userId;

        if (loggedInAdmin !== adminId) {
            return res.status(403).send({ status: false, message: "unauthorized" });
        };

        next();
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    };
};

module.exports = { adminAuthentication, adminAuthorization }