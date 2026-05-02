require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Community = require('./src/models/Community');
const Post = require('./src/models/Post');
const Comment = require('./src/models/Comment');

// Database connection
mongoose.connect('mongodb://127.0.0.1:27017/antigravity');

async function runSeed() {
  try {
    await User.deleteMany({});
    await Community.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});

    // 1. Create Users
    const user1 = await User.create({
      googleId: 'google1', email: 'alice@gmail.com', username: 'Alice', universityName: 'MIT', universityEmail: 'alice@mit.edu', isVerified: true, isAnonymous: false
    });
    const user2 = await User.create({
      googleId: 'google2', email: 'bob@gmail.com', username: 'Bob', universityName: 'Stanford', isAnonymous: true
    });
    
    // 2. Create Communities
    const com1 = await Community.create({
       name: 'CSMajors', description: 'Suffering through LeetCode', admins: [user1._id], members: [user1._id, user2._id]
    });
    const com2 = await Community.create({
       name: 'Advice', description: 'Life advice for students', admins: [user2._id], members: [user1._id, user2._id]
    });

    // 3. Create Posts
    const post1 = await Post.create({
      author: user1._id, community: com1._id, title: 'How to pass Data Structures?', content: 'I am struggling with graphs and dynamic programming. Any tips?',
      upvotes: [user2._id], engagementScore: 5 // Older post, high engagement
    });

    const post2 = await Post.create({
      author: user2._id, community: com2._id, title: 'Am I making a mistake?', content: 'I want to drop out and start a pizza shop.',
      isAnonymous: true,
      upvotes: [user1._id], engagementScore: 2
    });

    const post3 = await Post.create({
       author: user1._id, title: 'New to the app!', content: 'This liquid glass UI is pretty clean. Anti-gravity sorting is cool too.',
       upvotes: [], engagementScore: 0 // New post, 0 engagement. Should still get visibility in Anti-gravity
    });

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

runSeed();
