const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    enginid: {
        type: String,
        required: true
    },
    enginNom: {
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
    chauffeur: {
        type: String,
        required: true
    },
    montantChauffeur: {
        type: Number,
        required: true,
        default: 0
    },
    montantTotal: {
        type: Number,
        required: true,
        default: 0
    }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Reservation', reservationSchema);