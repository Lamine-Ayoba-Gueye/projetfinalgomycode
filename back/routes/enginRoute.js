const express = require('express');
const router = express.Router();
const multer = require('multer');

const Engin = require('../models/engin');

router.get('/getengins', async (req, res) => {
    try {
        const engins = await Engin.find();
        return res.json(engins);
    } catch (err) {
        res.status(500).json({ message: 'Error getting engins' });
    }
});

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "./public/images");
    },
    filename(req, file, cb) {
        cb(null, file.originalname);
    },
})

const upload = multer({ storage });

router.post('/engin', upload.single('img'), async (req, res) => {
    const { nom, numero, plaque, montant, chauffeurid } = req.body;
    const img = req.file ? req.file.filename : null;
    try {
        const engin = await Engin.create({ nom, numero, plaque, montant, chauffeurid, img });
        return res.json(engin);
    } catch (err) {
        res.status(500).json({ message: 'Error creating engin' });
    }
});

router.get('/getengin/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const engin = await Engin.findById(id);
        return res.json(engin);
    } catch (err) {
        res.status(500).json({ message: 'Error getting engin' });
    }
});

module.exports = router;