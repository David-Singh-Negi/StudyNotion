const express = require('express');
const app = express();

// routes 
const userRoutes = require('./routes/User');
const profileRoutes = require('./routes/Profile');
const courseRoutes = require('./routes/Course');

// databse, middlewares,cors, clodinary,imageUploader
const cookieParser = require('cookie-parser');
const dbConnect = require('./config/database');
const cors = require('cors');
const {cloudinaryConnect} = require('./config/cloudinary');
const fileUpload = require('express-fileupload');

// PORT
require('dotenv').config();
const PORT = process.env.PORT || 5000

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:3000",
	credentials:true,
}));
app.use(fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)

// cloudinaryConnect 
cloudinaryConnect();

// routeMounting
app.use("/api/v1/auth", userRoutes);
app.use('/api/v1/profile',profileRoutes);
app.use('/api/v1/course',courseRoutes);


app.listen(PORT, () => {
    console.log(`App running on PORT l.: ${PORT}`);
});

dbConnect();

