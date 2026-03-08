const express = require('express');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();

const User = require('./models/User');
const Asset = require('./models/Asset');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('BSIBG Database Connected!'))
.catch((err) => console.log('DB Connection Error:', err));

app.get('/admin-stats', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const modCount = await Asset.countDocuments({ category: 'mod' });
        const skinCount = await Asset.countDocuments({ category: 'skin' });
        
        res.send({
            totalUsers: userCount,
            totalMods: modCount, 
            totalSkins: skinCount
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

app.post('/upload-mod', async (req, res) => {
    const assetData = req.body;
    try {
        const newAsset = new Asset(assetData);
        const result = await newAsset.save();
        res.status(201).send({ 
            success: true, 
            message: 'Asset uploaded successfully!', 
            data: result 
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

app.get('/all-assets', async (req, res) => {
    try {
        const assets = await Asset.find().sort({ createdAt: -1 });
        res.send(assets);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

app.get('/users', async (req, res) => {
    const email = req.query.email;
    try {
        const user = await User.findOne({ email: email });
        if (!user) return res.status(200).send({});
        res.send(user);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

app.post('/users', async (req, res) => {
    const user = req.body;
    try {
        const query = { email: user.email };
        const existingUser = await User.findOne(query);
        if (existingUser) return res.send({ message: 'User already exists', user: existingUser });
        const newUser = new User(user);
        const result = await newUser.save();
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('BSIBG Server is Running...');
});

app.listen(PORT, () => {
    console.log(`Server zooming on port ${PORT}`);
});