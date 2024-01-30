const express = require("express")
const router = express.Router();

// CONTROLLERS -----------------------------------------------------------
// Course Conrollers
const {createCourse,getAllCourses,getCourseDetails} = require('../controllers/Course');
// Category Conrollers
const {createCategory,showAllCategories,categoryPageDetails} = require('../controllers/Category');
// Section Conrollers
const {createSection,updateSection,deleteSection} = require('../controllers/Section');
// Section Conrollers
const {createSubSection,updateSubSection,deleteSubSection} = require('../controllers/Subsection');
// Rating Conrollers
const {createRating,getAverageRating,getAllRating} = require('../controllers/RatingAndReview');

// Authentication & Authorization
const {auth,isAdmin,isInstructor,isStudent} = require('../middlewares/authWare');

// MAPPING----------------------------------------------------------------------
// INSTRUCTOR ----ONLY BY INSTRUCTORS------
router.post('/createCourse',auth,isInstructor,createCourse);
router.get('/getAllCourses',getAllCourses);
router.post('/getCourseDetails',getCourseDetails);

router.post('/createSection',auth,isInstructor,createSection);
router.post('/updateSection',auth,isInstructor,updateSection);
router.post('/deleteSection',auth,isInstructor,deleteSection);

router.post('/createSubSection',auth,isInstructor,createSubSection);
router.post('/updateSubSection',auth,isInstructor,updateSubSection);
router.post('/deleteSubSection',auth,isInstructor,deleteSubSection);

// ADMIN ----ONLY BY ADMIN------
router.post('/createCategory',auth,isAdmin,createCategory);
router.get('/showAllCategories',showAllCategories);
router.post('/categoryPageDetails',categoryPageDetails);

// STUDENT ----ONLY BY STUDENT------

router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)


// export
module.exports = router;