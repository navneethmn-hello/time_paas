const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', postController.getFeeds);
router.post('/', authMiddleware, postController.createPost);
router.post('/:id/vote', authMiddleware, postController.votePost);

module.exports = router;
