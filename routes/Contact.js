const express = require('express');
const router = express.Router();

// controller
const{contactFormDetails} = require('../controllers/ContactUs');


// mapping
router.post('/contactFormDetails',contactFormDetails);

// export
module.exports = router;