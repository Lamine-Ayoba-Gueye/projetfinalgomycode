const express = require('express');
const router = express.Router();

const Chauffeur = require('../models/chauffeur');

router.post('/addchauffeur', async (req, res) => {
    const { nom, telephone, numpermis, montant } = req.body;
    try {
        const chauffeur = new Chauffeur({ nom, telephone, numpermis, montant });
        const newchauffeur = await chauffeur.save();
        return res.json(newchauffeur);
    } catch (err) {
        res.status(500).json({ message: 'Error creating chauffeur' });
    }
});

router.get('/getchauffeurs', async (req, res) => {
    try {
        const chauffeurs = await Chauffeur.find({});
        return res.json(chauffeurs);
    } catch (err) {
        res.status(500).json({ message: 'Error getting chauffeurs' });
    }
});

router.get('/getchauffeur/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const chauffeur = await Chauffeur.findById(id);
        return res.json(chauffeur);
    } catch (err) {
        res.status(500).json({ message: 'Error getting chauffeur' });
    }
});

router.post('/updatechauffeur/:id', async (req, res) => {
    const { id } = req.params;
    const { nom, telephone, numpermis, montant } = req.body;
    try {
        const chauffeur = await Chauffeur.findByIdAndUpdate(id, { nom, telephone, numpermis, montant });
        if (!chauffeur) {
            return res.status(404).json({ message: 'Chauffeur not found' });
        }
        return res.json({ message: 'Chauffeur updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating chauffeur' });
    }
});

router.delete('/deletechauffeur/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const chauffeur = await Chauffeur.findByIdAndDelete(id);
        if (!chauffeur) {
            return res.status(404).json({ message: 'Chauffeur not found' });
        }
        return res.json({ message: 'Chauffeur deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting chauffeur' });
    }
});


module.exports = router;