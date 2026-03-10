const express = require('express');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();

const User = require('./models/User');
const Asset = require('./models/Asset');
const Subscriber = require('./models/Subscriber');

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

app.get('/assets/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const asset = await Asset.findById(id);
        if (!asset) {
            return res.status(404).send({ message: "Asset not found" });
        }
        res.send(asset);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

app.get('/latest-assets', async (req, res) => {
    try {
        const latestAssets = await Asset.find().sort({ createdAt: -1 }).limit(3);
        res.send(latestAssets);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

app.get('/all-assets', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const category = req.query.category || 'all';

        const skip = (page - 1) * limit;

        let query = {};
        if (category !== 'all') {
            query.category = category;
        }

        const assets = await Asset.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Asset.countDocuments(query);

        res.send({
            assets,
            hasMore: skip + assets.length < total
        });
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

app.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).send({ message: "Email is required!" });
        }

        const existingSubscriber = await Subscriber.findOne({ email });

        if (existingSubscriber) {
            return res.status(200).send({
                success: true,
                message: "You are already in the dispatch list!"
            });
        }

        const newSubscriber = new Subscriber({ email });
        await newSubscriber.save();

        res.status(201).send({
            success: true,
            message: "Alert initialized! Welcome to the hangar."
        });

    } catch (error) {
        console.error("Subscription Error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

app.get('/', (req, res) => {
    res.send('BSIBG Server is Running...');
});

app.listen(PORT, () => {
    console.log(`Server zooming on port ${PORT}`);
});