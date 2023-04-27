const {Router} = require('express');
const router = Router();
const authController = require('../controllers/authController.js')

router.post('/api/signup', (req, res, next) => {
    authController.signupHandler(req, res, next);
})

router.post('/api/login', (req, res, next) => {
    authController.loginHandler(req, res, next);
})

module.exports = router;
