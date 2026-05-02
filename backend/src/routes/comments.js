const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/post/:postId', commentController.getCommentsForPost);
router.post('/', authMiddleware, commentController.createComment);

module.exports = router;
