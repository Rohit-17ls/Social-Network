const {Router} = require('express');
const router = Router();
const authMiddleware = require('../middleware/authMiddleware');
const postCreationController = require('../controllers/postCreationController.js');



router.post('/api/newpost/get_signature', (req, res, next) => {
    console.log(req.body);
    postCreationController.get_signature(req, res, next);
});

router.post('/api/newpost/save_image', (req, res, next) => {
    postCreationController.save_image(req, res, next);
});

module.exports = router;