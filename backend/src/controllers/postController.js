const Post = require('../models/Post');
const User = require('../models/User');
const Community = require('../models/Community');
const { calculateAntiGravityScore } = require('../utils/antiGravity');

exports.createPost = async (req, res) => {
  try {
    const { title, content, community, imageUrl, tags, isAnonymous, language } = req.body;
    let postAnonymous = isAnonymous;
    
    const authorDoc = await User.doc(req.user.id).get();
    if(!authorDoc.exists) {
        return res.status(404).json({ message: 'User not found' });
    }
    const author = authorDoc.data();

    if(author.isAnonymous) {
        postAnonymous = true;
    }

    const newPost = {
      author: req.user.id,
      title,
      content,
      community: community || null,
      imageUrl: imageUrl || '',
      tags: tags || [],
      isAnonymous: postAnonymous,
      language: language || author.languagePreference || 'en',
      createdAt: new Date().toISOString(),
      upvotes: [],
      downvotes: [],
      engagementScore: 0
    };

    const docRef = await Post.add(newPost);
    res.status(201).json({ id: docRef.id, ...newPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFeeds = async (req, res) => {
  try {
    const { sort = 'anti-gravity', page = 1, limit = 20 } = req.query;
    
    // Fetch all posts for in-memory sorting MVP
    const snapshot = await Post.get();
    let posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // MVP: Sort in memory
    if (sort === 'anti-gravity') {
      posts.sort((a, b) => {
        const scoreA = calculateAntiGravityScore(a.upvotes?.length || 0, a.downvotes?.length || 0, a.createdAt, a.engagementScore || 0);
        const scoreB = calculateAntiGravityScore(b.upvotes?.length || 0, b.downvotes?.length || 0, b.createdAt, b.engagementScore || 0);
        return scoreB - scoreA;
      });
    } else if (sort === 'top') {
       posts.sort((a, b) => ((b.upvotes?.length || 0) - (b.downvotes?.length || 0)) - ((a.upvotes?.length || 0) - (a.downvotes?.length || 0)));
    } else if (sort === 'new') {
       posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const paginatedPosts = posts.slice(startIndex, startIndex + parseInt(limit));

    // Populate author and community manually for the paginated items
    const finalPosts = await Promise.all(paginatedPosts.map(async p => {
       const postObj = { ...p };
       
       if(postObj.isAnonymous) {
           postObj.author = { username: 'Anonymous', universityName: 'Hidden' };
       } else if (postObj.author) {
           const authorDoc = await User.doc(postObj.author).get();
           if(authorDoc.exists) {
               postObj.author = { username: authorDoc.data().username, universityName: authorDoc.data().universityName };
           }
       }

       if (postObj.community) {
           const commDoc = await Community.doc(postObj.community).get();
           if(commDoc.exists) {
               postObj.community = { id: commDoc.id, name: commDoc.data().name };
           }
       }
       
       return postObj;
    }));

    res.json(finalPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.votePost = async (req, res) => {
   try {
       const { type } = req.body; // 'upvote' or 'downvote', send empty to clear vote
       const postRef = Post.doc(req.params.id);
       const doc = await postRef.get();

       if(!doc.exists) return res.status(404).json({ message: 'Post not found' });
       
       const post = doc.data();
       let upvotes = post.upvotes || [];
       let downvotes = post.downvotes || [];
       let engagementScore = post.engagementScore || 0;

       upvotes = upvotes.filter(id => id !== req.user.id);
       downvotes = downvotes.filter(id => id !== req.user.id);

       if (type === 'upvote') {
           upvotes.push(req.user.id);
           engagementScore += 1;
       } else if (type === 'downvote') {
           downvotes.push(req.user.id);
       }

       await postRef.update({ upvotes, downvotes, engagementScore });
       res.json({ id: doc.id, ...post, upvotes, downvotes, engagementScore });
   } catch (error) {
       res.status(500).json({ error: error.message });
   }
};
