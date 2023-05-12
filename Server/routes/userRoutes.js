const Router = require('express');
const router = Router();
const userController = require('../controllers/userController.js');
const authMiddleware = require('../middleware/authMiddleware.js');


router.post('/api/user/:username', authMiddleware, async(req, res, next) => {
    userController.getUserData(req, res, next);
})

router.post('/api/followuser', authMiddleware, async(req, res, next) => {
    userController.followUser(req, res, next);
})

router.post('/api/userposts', authMiddleware, async(req, res, next) => {
    userController.retrieveUserPosts(req, res, next);
})

router.post('/api/connections', authMiddleware, async(req, res, next) => {
    userController.connections(req, res, next);
})

router.post('/api/userprofileimg', authMiddleware, async(req, res, next) => {
    userController.updateProfileImage(req, res, next);
})

router.post('/api/userdescription', authMiddleware, async(req, res, next) => {
    userController.updateDescription(req, res, next);
})

module.exports = router;