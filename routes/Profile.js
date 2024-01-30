const express = require('express');
const router = express.Router();

// controller
const {updateProfile,deleteAccount,getUserDetails,getEnrolledCourses,updateDisplayPicture} = require('../controllers/Profile')

// auth
const {auth} = require('../middlewares/authWare')

// mapping
router.get('/getUserDetails',auth,getUserDetails);
router.get('/getEnrolledCourses',auth,getEnrolledCourses);
router.delete('/deleteAccount',auth,deleteAccount);
router.put('/updateProfile',auth,updateProfile);
router.put('/updateDisplayPicture',auth,updateDisplayPicture);

// export
module.exports = router;