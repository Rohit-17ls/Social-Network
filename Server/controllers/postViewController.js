const jwt = require('jsonwebtoken');
const {pool} = require('../Database/connection.js');
const crypto = require('crypto');
require('dotenv').config();


const getHash = (secretValue, hashSource, algorithm = 'sha256') => {
    const hmac = crypto.createHmac(algorithm, secretValue);
    hmac.update(hashSource);
    return hmac.digest('hex');
}

module.exports.retrievePostData = async (req, res, next) => {
    try{
        console.log(req.params);
        const post_id = req.params.id;

        const connection = await pool.getConnection();
        const query1 = `SELECT users.username, posts.text_content, posts.img_version, posts.img_folder_name, posts.img_public_id, posts.time_stamp FROM users INNER JOIN posts ON users.user_id = posts.creator_id AND posts.post_id = '${post_id}';`;
        const [rows1, fields1] = await connection.execute(query1);
        
        const data = {...rows1[0], links: [], tags: []};

        const query2 = `SELECT link from post_links where post_id = '${post_id}';`;
        const [rows2, fields2] = await connection.execute(query2);

        for(let item of rows2) data.links.push(item.link);
        
        const query3 = `SELECT tag from post_tags where post_id = '${post_id}';`;
        const [rows3, fileds3] = await connection.execute(query3);
        
        for(let item of rows3) data.tags.push(item.tag);
        console.log(data);


        res.json({status : "Fetched post data", isRetreived : true, ...data});

    }catch(err){
        console.log(err);
        res.json({status : "Couldn't find the post you're looking for", isRetreived : false});
    }
}