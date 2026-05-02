const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', default: null }, // Global if null
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, default: null },
  tags: [{ type: String }],
  isAnonymous: { type: Boolean, default: false },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  engagementScore: { type: Number, default: 0 }, // For Anti-Gravity Algorithm
  language: { type: String, default: 'en' },
}, { timestamps: true });

// Virtual for getting the absolute score (upvotes - downvotes)
postSchema.virtual('score').get(function() {
  return this.upvotes.length - this.downvotes.length;
});

module.exports = mongoose.model('Post', postSchema);
