const express = require('express');

const router = express.Router();

const { generateOTP, verifyOTP } = require('../controllers/otpController');
const { newAdmin, adminLogin, updateAdmin, forgotPassword, adminLogout } = require('../controllers/adminController');
const { newDriver, fetchDriver } = require('../controllers/driverController');
const { adminAuthentication, adminAuthorization } = require('../middlewares/auth');

// =================== user APIS ================

router.post('/otp', generateOTP);
router.post('/verifyOTP', verifyOTP);
router.post('/register', newAdmin);
router.post('/login', adminLogin);
router.put('/admin/:adminId', adminAuthentication, adminAuthorization, updateAdmin);
router.post('/forgot', forgotPassword);
router.get('/logout', adminLogout);

// =================== driver APIS =================

router.post('/driver', adminAuthentication, newDriver);
router.get('/driver', fetchDriver);

module.exports = router;
