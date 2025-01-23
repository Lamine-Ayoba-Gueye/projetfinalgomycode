const express = require('express');
const router = express.Router();

const Reservation = require('../models/reservation');

router.post('/reservation', async (req, res) => {
    const { enginid, debut, fin, acquereur, chauffeurid } = req.body;
    try {
        const user = await User.findOne({ email: acquereur });
        if (user) {
            const reservation = await Reservation.create({ enginid, debut, fin, acquereur, chauffeurid });
            return res.json(reservation);
        } else {
            return res.status(401).json({ message: 'Invalid email' });
        }
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

module.exports = router;