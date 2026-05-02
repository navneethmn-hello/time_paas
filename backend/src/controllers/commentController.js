const Comment = require('../models/Comment');
const User = require('../models/User');

exports.createComment = async (req, res) => {
  try {
    const { postId, content, parentComment, isAnonymous } = req.body;
    
    let commentAnonymous = isAnonymous;
    const author = await User.findById(req.user.id);
    if(author.isAnonymous) {
        commentAnonymous = true;
    }

    const comment = await Comment.create({
      post: postId,
      author: req.user.id,
      content,
      parentComment: parentComment || null,
      isAnonymous: commentAnonymous
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCommentsForPost = async (req, res) => {
   try {
     const comments = await Comment.find({ post: req.params.postId }).populate('author', 'username universityName');
     
     const finalComments = comments.map(c => {
       const commentObj = c.toObject();
       if(commentObj.isAnonymous) {
           commentObj.author = { username: 'Anonymous', universityName: 'Hidden' };
       }
       return commentObj;
    });

     res.json(finalComments);
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
}
