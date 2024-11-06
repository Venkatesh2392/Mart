const express = require('express');
const { Signup, Login, verifyOtp, forgotPassword, resetPassword } = require('../Controllers/Usercontroller');
const router = express.Router();

router.post('/Signup', Signup);
router.post('/login', Login);
router.post('/verify-otp', verifyOtp);
router.post('/forgot-password', forgotPassword); 
router.post('/reset-password', resetPassword); 

module.exports = router;
