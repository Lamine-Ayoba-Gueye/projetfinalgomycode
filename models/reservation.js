const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    enginid: {
        type: String,
        required: true
    },
    debut: {
        type: String,
        required: true
    },
    fin: {
        type: String,
        required: true
    },
    acquereur: {
        type: String,
        required: true
    },
    chauffeurid: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Reservation', reservationSchema);