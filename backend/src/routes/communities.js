const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', communityController.getCommunities);
router.post('/', authMiddleware, communityController.createCommunity);
router.post('/:id/join', authMiddleware, communityController.joinCommunity);

module.exports = router;
