const Router = require('express');
const router = Router();
const userController = require('../controllers/userController.js');
const authMiddleware = require('../middleware/authMiddleware.js');


router.post('/api/user/:username', authMiddleware, async(req, res, next) => {
    console.log('/api/user/:username');
    userController.getUserData(req, res, next);
})

router.post('/api/followuser', authMiddleware, async(req, res, next) => {
    console.log('/api/followuser');
    userController.followUser(req, res, next);
})

router.post('/api/userposts', authMiddleware, async(req, res, next) => {
    console.log('/api/userposts');
    userController.retrieveUserPosts(req, res, next);
})

router.post('/api/connections', authMiddleware, async(req, res, next) => {
    console.log('/api/connections');
    userController.connections(req, res, next);
})

router.post('/api/userprofileimg', authMiddleware, async(req, res, next) => {
    console.log('/api/userprofileimg');
    userController.updateProfileImage(req, res, next);
})

router.post('/api/userdescription', authMiddleware, async(req, res, next) => {
    console.log('/api/userdescription');
    userController.updateDescription(req, res, next);
})

router.post('/api/recommended', async(req, res, next) => {
    console.log('/api/recommended');
    userController.getRecommendedUsers(req, res, next);
})

module.exports = router;