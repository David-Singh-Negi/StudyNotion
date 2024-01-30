

// create user 

{
    "firstName":"David",
    "lastName":"Singh Negi",
    "email":"davidsingh10259@gmail.com",
    "password":"1234",
    "confirmPassword":"1234",
    "accountType":"Student",
    "contactNumber":"8340601366",
    "otp":""
}

{
    "firstName":"Daniel",
    "lastName":"Singh Negi",
    "email":"davidhell10259@gmail.com",
    "password":"12345",
    "confirmPassword":"12345",
    "accountType":"Instructor",
    "contactNumber":"8340601369",
    "otp":"496357"
}

{
    "firstName":"Dinesh",
    "lastName":"Singh Negi",
    "email":"davidsinghnegi980@gmail.com",
    "password":"12345",
    "confirmPassword":"12345",
    "accountType":"Admin",
    "contactNumber":"8340601369",
    "otp":"841092"
}
// DELETE ACCOUNT 
http://localhost:4000/api/v1/profile/deleteAccount

// LOGIN
http://localhost:4000/api/v1/auth/login
{
    "email":"davidsingh10259@gmail.com",
    "password":"12345"
}

// ADMIN-----------------------------------
{
    "email":"davidhell10259@gmail.com",
    "password":"123456"
}

// INSTRUCTOR-----------------------------------
{
    "email":"davidsinghnegi980@gmail.com",
    "password":"1234567"
}

// update picture
http://localhost:4000/api/v1/profile/updateDisplayPicture

// update profile
http://localhost:4000/api/v1/profile/updateProfile

// password token
http://localhost:4000/api/v1/auth/resetpasswordtoken
{
    "email":"davidsingh10259@gmail.com"
}

// Password Change

{
    "password":"12345",
    "confirmPassword":"12345",
    "token":""
}

// CREATE CATEGORY -----------------------------------------------------

http://localhost:4000/api/v1/course/createCategory

{
    "name":"AI & ML",
    "description":"Badiya hai bohot , scope bohot hai"
}

// GET ALL CATEGORY
http://localhost:4000/api/v1/course/showAllCategories


// COURSES -------------------------------------------------------------

// CREATE COURSE
http://localhost:4000/api/v1/course/createCourse


// Get ALL COURSES
http://localhost:4000/api/v1/course/getAllCourses

// Get COURSE Details
http://localhost:4000/api/v1/course/getCourseDetails



// Section -------------------------------------------------------------
http://localhost:4000/api/v1/course/createSection
{
    "sectionName":"AI -I",
    "courseId":"65a445aac28f519159635ebd"
}