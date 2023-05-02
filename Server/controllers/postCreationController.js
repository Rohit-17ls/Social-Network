const cloudinary = require('cloudinary').v2
require('dotenv').config();

const cloudinaryConfig = cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  })

module.exports.get_signature = async(req, res, next) => {
    const timestamp = Math.round(new Date().getTime() / 1000)
    const signature = cloudinary.utils.api_sign_request(
        {
        timestamp: timestamp
        },
        cloudinaryConfig.api_secret
    )
    res.json({ timestamp, signature })
}

module.exports.save_image = async(req, res, next) => {
    console.log(req.body);
}