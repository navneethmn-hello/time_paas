const Post = require('../models/Post');
const User = require('../models/User');
const { calculateAntiGravityScore } = require('../utils/antiGravity');

exports.createPost = async (req, res) => {
  try {
    const { title, content, community, imageUrl, tags, isAnonymous, language } = req.body;
    let postAnonymous = isAnonymous;
    
    // User profile anonymous setting override
    const author = await User.findById(req.user.id);
    if(author.isAnonymous) {
        postAnonymous = true;
    }

    const post = await Post.create({
      author: req.user.id,
      title,
      content,
      community: community || null,
      imageUrl,
      tags,
      isAnonymous: postAnonymous,
      language: language || author.languagePreference
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFeeds = async (req, res) => {
  try {
    const { sort = 'anti-gravity', page = 1, limit = 20 } = req.query;
    
    const posts = await Post.find()
      .populate('author', 'username universityName')
      .populate('community', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    let sortedPosts = posts;

    // MVP: Sort in memory
    if (sort === 'anti-gravity') {
      sortedPosts = posts.sort((a, b) => {
        const scoreA = calculateAntiGravityScore(a.upvotes.length, a.downvotes.length, a.createdAt, a.engagementScore);
        const scoreB = calculateAntiGravityScore(b.upvotes.length, b.downvotes.length, b.createdAt, b.engagementScore);
        return scoreB - scoreA;
      });
    } else if (sort === 'top') {
       sortedPosts = posts.sort((a, b) => (b.upvotes.length - b.downvotes.length) - (a.upvotes.length - a.downvotes.length));
    } else if (sort === 'new') {
       sortedPosts = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Mask author if anonymous
    const finalPosts = sortedPosts.map(p => {
       const postObj = p.toObject();
       if(postObj.isAnonymous) {
           postObj.author = { username: 'Anonymous', universityName: 'Hidden' };
       }
       return postObj;
    });

    res.json(finalPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.votePost = async (req, res) => {
   try {
       const { type } = req.body; // 'upvote' or 'downvote', send empty to clear vote
       const post = await Post.findById(req.params.id);

       if(!post) return res.status(404).json({ message: 'Post not found' });

       post.upvotes = post.upvotes.filter(id => id.toString() !== req.user.id);
       post.downvotes = post.downvotes.filter(id => id.toString() !== req.user.id);

       if (type === 'upvote') {
           post.upvotes.push(req.user.id);
           post.engagementScore += 1;
       } else if (type === 'downvote') {
           post.downvotes.push(req.user.id);
       }

       await post.save();
       res.json(post);
   } catch (error) {
       res.status(500).json({ error: error.message });
   }
}
