const express = require('express');
const router = express.Router();

const User = require('../models/user');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && user.password === password) {
            return res.send(user);
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error logging in' });
    }
});

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.create({ name, email, password });
        return res.json({ user });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user' });
    }
});

router.get('/getusers', async (req, res) => {
    try {
        const users = await User.find();
        return res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error getting users' });
    }
});

router.get('/getusers/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        return res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error getting user' });
    }
});

router.delete('/deleteuser/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        return res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user' });
    }
});

router.post('/updateuser/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body);
        return res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error updating user' });
    }
});

module.exports = router;