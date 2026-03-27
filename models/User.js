const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  photoURL: { type: String },
  role: { 
    type: String, 
    enum: ['user', 'moderator', 'admin'], 
    default: 'user' 
  },
  totalPoints: { type: Number, default: 0 },
  monthlyPoints: { type: Number, default: 0 },
}, { timestamps: true }); 

module.exports = mongoose.model('User', userSchema);