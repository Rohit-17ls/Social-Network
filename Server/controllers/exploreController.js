const {pool} = require('../Database/connection.js');
const crypto = require('crypto');
require('dotenv').config();


const getHash = (secretValue, hashSource, algorithm = 'sha256') => {
    const hmac = crypto.createHmac(algorithm, secretValue);
    hmac.update(hashSource);
    return hmac.digest('hex');
}


module.exports.retrievePosts = async(req, res, next) => {
    try{
        const offset = req.body.offset;
        const current_user_id = getHash('user_id', JSON.parse(Buffer.from(req.cookies.jwt.split('.')[1], 'base64').toString()).username);

        const connection = await pool.getConnection();
        const query1 = ` SELECT users.username, posts.post_id, posts.time_stamp, posts.img_folder_name, posts.img_public_id, posts.img_version, posts.text_content, posts.likes, posts.dislikes FROM users INNER JOIN posts ON users.user_id = posts.creator_id ORDER BY posts.time_stamp desc LIMIT 3 OFFSET ${offset};`;
        console.log(query1);
        const [rows1, fields1] = await connection.execute(query1);
        
        if(!rows1.length){
            connection.release();
            res.json({isRetrieved: false,  status: 'No posts available'});
            return;
        }

        const posts = rows1;

        for(let post of posts){
            const query2 = `SELECT post_tags.tag FROM posts INNER JOIN post_tags ON posts.post_id = post_tags.post_id AND posts.post_id = '${post.post_id}';`;
            const [rows2, fields2] = await connection.execute(query2);
            const query3 = `SELECT  post_links.link FROM posts INNER JOIN post_links ON posts.post_id = post_links.post_id AND posts.post_id = '${post.post_id}';`;
            const [rows3, fields3] = await connection.execute(query3);
            const query4 = `SELECT vote_type as userVote FROM votes WHERE user_id = '${current_user_id}' AND post_id = '${post.post_id}';`;
            const [rows4, fields4] = await connection.execute(query4);

            post.tags = rows2;
            post.links = rows3;
            post.userVote = rows4.length ? rows4[0].userVote : null;
        }

        connection.release();

        res.json({isRetrieved: true, posts});

    }catch(err){
        console.log(err);
        res.json({isRetrieved: false,  status: 'No posts available'});
    }
}

module.exports.retrievePost = async(req, res, next) => {
    try{
        const post_id = req.body.post_id;
        const current_user_id = getHash('user_id', JSON.parse(Buffer.from(req.cookies.jwt.split('.')[1], 'base64').toString()).username);

        const connection = await pool.getConnection();
        const query1 = ` SELECT users.username, posts.post_id, posts.time_stamp, posts.img_folder_name, posts.img_public_id, posts.img_version, posts.text_content, posts.likes, posts.dislikes FROM users INNER JOIN posts ON users.user_id = posts.creator_id AND posts.post_id = '${post_id}';`;
        console.log(query1);
        const [rows1, fields1] = await connection.execute(query1);
        
        if(!rows1.length){
            connection.release();
            res.json({isRetrieved: false, status: 'No posts available'});
            return;
        }

        const post = rows1;

        
        const query2 = `SELECT post_tags.tag FROM posts INNER JOIN post_tags ON posts.post_id = post_tags.post_id AND posts.post_id = '${post.post_id}';`;
        const [rows2, fields2] = await connection.execute(query2);
        const query3 = `SELECT  post_links.link FROM posts INNER JOIN post_links ON posts.post_id = post_links.post_id AND posts.post_id = '${post.post_id}';`;
        const [rows3, fields3] = await connection.execute(query3);
        const query4 = `SELECT vote_type as userVote FROM votes WHERE user_id = '${current_user_id}' AND post_id = '${post.post_id}';`;
        const [rows4, fields4] = await connection.execute(query4);

        post.tags = rows2;
        post.links = rows3;
        post.userVote = rows4.length ? rows4[0].userVote : null;

        connection.release();

        res.json({isRetrieved: true, data: post});

    }catch(err){
        console.log(err);
        res.json({isRetrieved: false,  status: 'No posts available'});
    }
}