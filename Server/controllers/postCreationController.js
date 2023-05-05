const cloudinary = require('cloudinary').v2
const {pool} = require('../Database/connection.js');
const crypto = require('crypto');
require('dotenv').config();

const cloudinaryConfig = cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  })


const getHash = (secretValue, hashSource, algorithm = 'sha256') => {
    const hmac = crypto.createHmac(algorithm, secretValue);
    hmac.update(hashSource);
    return hmac.digest('hex');
}

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

module.exports.make_post = async(req, res, next) => {
    console.log(req.body);
    const {img_version, img_folder_name, img_public_id, text_content, links, tags} = req.body;

    try{
        const username = JSON.parse(Buffer.from(req.cookies.jwt.split('.')[1], 'base64').toString()).username;
        const creator_id = getHash('user_id', username);
        const post_id = getHash('post', username + new Date().valueOf());

        const connection = await pool.getConnection();
        const postQuery1 = `INSERT INTO posts(post_id, creator_id, img_folder_name, img_public_id, img_version, text_content) VALUES('${post_id}', '${creator_id}', '${img_folder_name}', '${img_public_id}', '${img_version}', ${connection.escape(text_content)});`; 
        let [response] = await connection.execute(postQuery1);

        if(links.length){
            for(let i=0; i<links.length; i++){
                const postQuery2 = `INSERT INTO post_links(post_id, link) VALUES('${post_id}', '${links[i]}');`;
                [response] = await connection.execute(postQuery2);
            }
        }
        
        if(tags.length){
            for(let i=0; i<tags.length; i++){
                const postQuery3 = `INSERT INTO post_tags(post_id, tag) VALUES('${post_id}', '${tags[i]}');`;
                [response] = await connection.execute(postQuery3);
            }
        }

        connection.release();

        res.json({isPosted: true, status : 'Post Created !!', post_id});
        
    }catch(err){
        console.log(err);
        res.json({isPosted: false, status : "Couldn't create post !!"});
    }
}