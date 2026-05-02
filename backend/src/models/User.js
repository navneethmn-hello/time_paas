const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true }, // Regular google email
  universityEmail: { type: String, default: null }, // To be verified
  isVerified: { type: Boolean, default: false }, // AI Verification mock flags this
  username: { type: String, required: true, unique: true },
  universityName: { type: String, default: 'Unknown University' },
  bio: { type: String, default: '' },
  languagePreference: { type: String, default: 'en' }, // 'en', 'kn', 'hi', 'fr', 'zh'
  isAnonymous: { type: Boolean, default: false }, // General anonymous mode toggle
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
