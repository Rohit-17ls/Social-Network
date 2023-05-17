const Router = require('express');
const router = Router();
const authMiddleware = require('../middleware/authMiddleware');
const exploreController = require('../controllers/exploreController')

router.post('/api/explore/post', authMiddleware, async(req, res, next) => {
    exploreController.retrievePost(req, res, next);
});

router.post('/api/explore', authMiddleware, async(req, res, next) => {
    exploreController.retrievePosts(req, res, next);
});


module.exports = router;