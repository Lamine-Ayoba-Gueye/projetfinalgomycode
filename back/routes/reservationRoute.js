const express = require('express');
const router = express.Router();

const Reservation = require('../models/reservation');
const Engin = require('../models/engin');

router.post('/reservation', async (req, res) => {
    const { enginid, enginNom, debut, fin, acquereur, chauffeur, montantChauffeur, montantTotal } = req.body;
    try {
        const reservation = await Reservation.create({ enginid, enginNom, debut, fin, acquereur, chauffeur, montantChauffeur, montantTotal });
        const reservationEngin = await Engin.findById(enginid);
        reservationEngin.reservationEnCours.push({ reservationid: reservation._id, debut: debut, fin: fin, acquereur: acquereur, chauffeur: chauffeur, montantTotal: montantTotal });
        await reservationEngin.save();
        return res.json(reservation);
    } catch (err) {
        res.status(500).json({ message: 'Error creating reservation' });
    }
});

router.get('/getreservations', async (req, res) => {
    try {
        const reservations = await Reservation.find();
        return res.json(reservations);
    } catch (err) {
        res.status(500).json({ message: 'Error getting reservations' });
    }
});

router.delete('/deletereservation/:id', async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndDelete(req.params.id);
        return res.json(reservation);
    } catch (err) {
        res.status(500).json({ message: 'Error deleting reservation' });
    }
});

module.exports = router;