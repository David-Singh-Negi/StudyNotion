const express = require('express');
const router = express.Router();

// controllers
const{signUp,logIn,sendOTP,changePassword} = require('../controllers/Auth');
const{resetPasswordToken,resetPassword} = require('../controllers/ResetPassword');


// authorization
const {auth} = require('../middlewares/authWare');

// route mapping (LOGIN SIGNUP)
router.post('/signup',signUp);
router.post('/login',logIn);
router.post('/sendotp',sendOTP);
router.post('/changepassword',auth,changePassword);

// route mapping (PASSWORD RESET)
router.post('/resetpasswordtoken',resetPasswordToken);
router.post('/resetpassword',resetPassword);

// export
module.exports = router;