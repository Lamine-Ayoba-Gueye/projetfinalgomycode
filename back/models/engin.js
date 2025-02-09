const mongoose = require('mongoose');

const enginSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    numero: {
        type: String,
        required: true
    },
    plaque: {
        type: String,
        required: true
    },
    montant: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: false
    },
    chauffeurid: {
        type: String,
        required: false
    },
    reservationEnCours: [{ type: Object }]
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Engin', enginSchema);