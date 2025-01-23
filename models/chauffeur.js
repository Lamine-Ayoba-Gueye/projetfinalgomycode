const mongoose = require('mongoose');

const chauffeurSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    telephone: {
        type: String,
        required: true
    },
    numpermis: {
        type: String,
        required: true
    },
    montant: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Chauffeur', chauffeurSchema);