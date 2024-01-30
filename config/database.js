const mongoose = require('mongoose');

require('dotenv').config();

const dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL,{})
    .then( () => console.log("Database Successfully Connected"))
    .catch( (error) => {
        console.error(error);
        console.log('Error while database connection');
        process.emit(1);
    })
}

module.exports = dbConnect;