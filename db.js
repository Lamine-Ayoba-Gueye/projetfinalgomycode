const mongoose = require('mongoose');
var mongoUrl = 'mongodb+srv://lamineayoba:6Y9IK3YvgivvT0Rk@clusterengin.ylb5f.mongodb.net/enginmairie';

mongoose.connect(mongoUrl);
var connection = mongoose.connection;

connection.on('connected', function () {
    console.log('MongoDB Connected');
});

connection.on('error', function (err) {
    console.log('MongoDB Connection Error: ' + err);
});

module.exports = mongoose;