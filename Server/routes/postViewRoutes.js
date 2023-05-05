const {Router} = require('express');
const router = Router();
const postViewController = require('../controllers/postViewController.js')

router.get('/api/post/:id', async(req, res, next) => {
    postViewController.retrievePostData(req, res, next);
})


module.exports = router;