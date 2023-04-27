const jwt = require('jsonwebtoken');
require('dotenv').config();


const createToken = (username) => {
    return jwt.sign({username}, process.env.ACCESS_TOKEN_SECRET.toString(), {expiresIn : 3*24*3600});
}

module.exports.signupHandler = (req, res, next) => {
    console.log(req.body);
    res.json({status : 'Received Request'});
}

module.exports.loginHandler = (req, res, next) => {
    console.log(req.body);
    const {username, password} = req.body;
    const token = createToken(username);
    res.status(200).cookie('jwt', token, {httpOnly:false, maxAge: 3*24*60*60*1000, secure: true});
    res.json({status : 'Received Request'});
}