const express = require('express');

const router = express.Router();

const { generateOTP, verifyOTP } = require('../controllers/otpController');
const { newAdmin, adminLogin, updateAdmin, forgotPassword, adminLogout } = require('../controllers/adminController');
const { newDriver, fetchDriver, uodateDriver, deleteDriver } = require('../controllers/driverController');
const { newTruck, fetchTruck, updateTruck, deleteTruck } = require('../controllers/truckController');
const { adminAuthentication, adminAuthorization } = require('../middlewares/auth');

// =================== admin APIS ================

router.post('/otp', generateOTP);
router.post('/verifyOTP', verifyOTP);
router.post('/register', newAdmin);
router.post('/login', adminLogin);
router.put('/admin/:adminId', adminAuthentication, adminAuthorization, updateAdmin);
router.post('/forgot', forgotPassword);
router.get('/logout', adminLogout);

// =================== driver APIS =================

router.post('/driver', adminAuthentication, newDriver);
router.get('/driver', adminAuthentication, fetchDriver);
router.put('/driver/:driverId', adminAuthentication, uodateDriver);
router.delete('/driver/:driverId', adminAuthentication, deleteDriver)

// =================== truck APIS =================

router.post('/truck', adminAuthentication, newTruck);
router.get('/truck', adminAuthentication, fetchTruck);
router.put('/truck/:truckId', adminAuthentication, updateTruck);
router.delete('/truck/:truckId', adminAuthentication, deleteTruck);

module.exports = router;
