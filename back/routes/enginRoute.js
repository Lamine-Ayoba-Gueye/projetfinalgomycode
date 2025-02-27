const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

const Engin = require('../models/engin');

const publicImagesPath = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(publicImagesPath)) {
    fs.mkdirSync(publicImagesPath, { recursive: true });
}
app.use('/public/images', express.static(publicImagesPath));
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, publicImagesPath);
    },
    filename(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Nom de fichier unique
    },
});
const upload = multer({ storage });

app.post('/upload', upload.single('img'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "Aucun fichier uploadé." });
    }
    const imageUrl = `/public/images/${req.file.filename}`;
    res.json({ message: "Fichier uploadé avec succès.", url: imageUrl });
});

router.post('/engin', upload.single('img'), async (req, res) => {
    const { nom, numero, plaque, montant, chauffeurid } = req.body;
    const img = req.file ? req.file.filename : null;

    if (!nom || !numero || !plaque || !montant) {
        return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
    }

    try {
        const engin = await Engin.create({ nom, numero, plaque, montant, chauffeurid, img });
        return res.status(201).json(engin);
    } catch (err) {
        console.error("Erreur lors de la création de l'engin:", err);
        return res.status(500).json({ message: "Erreur serveur lors de la création de l'engin." });
    }
});

router.get('/getengins', async (req, res) => {
    try {
        const engins = await Engin.find();
        return res.json(engins);
    } catch (err) {
        res.status(500).json({ message: 'Error getting engins' });
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

router.put('/updateEngin/:id', upload.single('img'), async (req, res) => {
    const { id } = req.params;
    const { nom, numero, plaque, montant, chauffeurid } = req.body;
    const img = req.file ? req.file.filename : null;

    try {
        const engin = await Engin.findById(id);
        if (!engin) {
            return res.status(404).json({ message: "Engin non trouvé." });
        }

        engin.nom = nom;
        engin.numero = numero;
        engin.plaque = plaque;
        engin.montant = montant;
        engin.chauffeurid = chauffeurid;
        if (img) {
            if (engin.img) {
                const fs = require('fs');
                const oldImagePath = path.join(__dirname, '..', 'public', 'images', engin.img);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            engin.img = img;
        }

        await engin.save();

        res.json({ message: "Engin modifié avec succès.", engin });
    } catch (error) {
        console.error("Erreur lors de la modification de l'engin:", error);
        res.status(500).json({ message: "Erreur serveur lors de la modification de l'engin." });
    }
});

router.delete('/deleteEngin/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const engin = await Engin.findById(id);
        if (!engin) {
            return res.status(404).json({ message: "Engin non trouvé." });
        }

        // Supprimez l'engin
        await Engin.findByIdAndDelete(id);

        // Supprimez l'image associée si elle existe
        if (engin.img) {
            const fs = require('fs');
            const path = require('path');
            const imagePath = path.join(__dirname, '..', 'public', 'images', engin.img);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        res.json({ message: "Engin supprimé avec succès." });
    } catch (error) {
        console.error("Erreur lors de la suppression de l'engin:", error);
        res.status(500).json({ message: "Erreur serveur lors de la suppression de l'engin." });
    }
});

module.exports = router;