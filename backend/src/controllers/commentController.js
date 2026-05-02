const Comment = require('../models/Comment');
const User = require('../models/User');

exports.createComment = async (req, res) => {
  try {
    const { postId, content, parentComment, isAnonymous } = req.body;
    
    let commentAnonymous = isAnonymous;
    const authorDoc = await User.doc(req.user.id).get();
    if(!authorDoc.exists) {
        return res.status(404).json({ message: 'User not found' });
    }
    const author = authorDoc.data();

    if(author.isAnonymous) {
        commentAnonymous = true;
    }

    const newComment = {
      post: postId,
      author: req.user.id,
      content,
      parentComment: parentComment || null,
      isAnonymous: commentAnonymous,
      createdAt: new Date().toISOString(),
      upvotes: [],
      downvotes: []
    };

    const docRef = await Comment.add(newComment);
    res.status(201).json({ id: docRef.id, ...newComment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCommentsForPost = async (req, res) => {
   try {
     const snapshot = await Comment.where('post', '==', req.params.postId).get();
     const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
     
     const finalComments = await Promise.all(comments.map(async c => {
       const commentObj = { ...c };
       
       if(commentObj.isAnonymous) {
           commentObj.author = { username: 'Anonymous', universityName: 'Hidden' };
       } else if (commentObj.author) {
           const authorDoc = await User.doc(commentObj.author).get();
           if(authorDoc.exists) {
               commentObj.author = { username: authorDoc.data().username, universityName: authorDoc.data().universityName };
           }
       }
       return commentObj;
    }));

     res.json(finalComments);
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
};
