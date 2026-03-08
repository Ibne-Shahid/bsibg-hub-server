const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['mod', 'skin'], required: true },
    images: { type: [String], required: true },
    downloadUrl: { type: String, required: true },
    creatorName: { type: String, required: true },
    uploaderEmail: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Asset', assetSchema);