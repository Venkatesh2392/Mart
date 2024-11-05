const mongoose = require('mongoose');

const connectDB = () => {
    mongoose.connect('mongodb://127.0.0.1:27017/EmployeeDB')
    .then(()=>console.log('MongoDB connected..'))
    .catch(err=>console.err('MongoDb connection error',err))
};

module.exports = connectDB;
