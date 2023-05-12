const {pool} = require('../Database/connection.js');
const crypto = require('crypto');
require('dotenv').config();


const getHash = (secretValue, hashSource, algorithm = 'sha256') => {
    const hmac = crypto.createHmac(algorithm, secretValue);
    hmac.update(hashSource);
    return hmac.digest('hex');
}

module.exports.getUserData = async(req, res, next) => {
    try{
        const current_username = JSON.parse(Buffer.from(req.cookies.jwt.split('.')[1], 'base64').toString()).username;
        const user_id = getHash('user_id', req.params.username);
        const isViewingSelf = req.params.username === current_username;

        const connection = await pool.getConnection();

        const query1 = `SELECT email, img_folder_name as imgFolderName, img_public_id as imgPublicID, img_version as imgVersion, description, (SELECT count(*) FROM connections WHERE following_id = '${user_id}') as followers, (SELECT count(*) as following FROM connections WHERE follower_id = '${user_id}') as following FROM users WHERE user_id = '${user_id}';`;
        const [rows1, fields1] = await connection.execute(query1);
        
        console.log(rows1);
        let data = {...rows1[0], isViewingSelf: req.params.username === current_username};

        if(!rows1.length){
            res.json({isNotFound: true});
            return;
        }

        if(!isViewingSelf){
            const query = `SELECT count(*) as is_following FROM connections WHERE follower_id = '${getHash('user_id', current_username)}' AND following_id = '${user_id}';`;
            const [row, field] = await connection.execute(query);
            data = {...data, isFollowing: row[0].is_following};
        }
        
        const query2 = `SELECT groupname from public_groups INNER JOIN groups INNER JOIN user_groups ON groups.group_id = public_groups.group_id AND user_groups.group_id = public_groups.group_id AND user_groups.user_id = '${user_id}';`;
        const [rows2, fields2] = await connection.execute(query2);

        const query3 = `SELECT count(*) as postsCount FROM posts WHERE creator_id = '${user_id}';`;
        const [rows3, fields3] = await connection.execute(query3);

        data = {...data, groups: rows2, postsCount : rows3[0].postsCount};

        connection.release();
        res.json({isRetrieved: true, data});


    }catch(err){
        console.log(err);
        res.json({isRetrieved: false})
    }
}

module.exports.followUser = async(req, res, next) => {
    try{
        const current_user_id  = getHash('user_id', JSON.parse(Buffer.from(req.cookies.jwt.split('.')[1], 'base64').toString()).username);
        const target_user_id = getHash('user_id', req.body.targetUsername);

        const connection = await pool.getConnection();
        const query = `call follow_user('${current_user_id}', '${target_user_id}');`;
        const [result] = await connection.execute(query);

        connection.release();
        res.json({isUpdatedFollowStatus : true});
        
    }catch(err){
        console.log(err);
        res.json({isUpdatedFollowStatus: false})        
    }
}


module.exports.retrieveUserPosts = async(req, res, next) => {
    try{
        const current_username = JSON.parse(Buffer.from(req.cookies.jwt.split('.')[1], 'base64').toString()).username;
        const username = req.body.username;
        const user_id = getHash('user_id', username);
        const current_user_id = getHash('user_id', current_username);

        const isViewingSelf = username === current_username;

        const connection = await pool.getConnection();
        const query1 = `SELECT users.username, posts.post_id, posts.time_stamp, posts.img_folder_name, posts.img_public_id, posts.img_version, posts.text_content, posts.likes, posts.dislikes FROM users INNER JOIN posts ON users.user_id = posts.creator_id ${isViewingSelf ? '' :  "AND posts.is_private = '0'"} AND posts.creator_id = '${user_id}' ORDER BY posts.time_stamp desc;`;
        console.log(query1);
        const [rows1, fields1] = await connection.execute(query1);
        
        if(!rows1.length){
            res.json({isRetrieved: false, status: 'No posts yet'});
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
        res.json({isRetrieved: false, status: 'Something went wrong'});
    }
}


module.exports.connections = async(req, res, next) => {
    try{
        const username = req.body.username;
        const user_id = getHash('user_id', username);

        const connection = await pool.getConnection();
        const query1 = `SELECT users.username FROM users INNER JOIN connections WHERE users.user_id = connections.follower_id AND connections.following_id = '${user_id}';`;
        const [rows1, fields1] = await connection.execute(query1);
 
        const query2 = `SELECT users.username FROM users INNER JOIN connections WHERE users.user_id = connections.following_id AND connections.follower_id = '${user_id}';`;
        const [rows2, fields2] = await connection.execute(query2);

        connection.release();

        res.json({isRetrieved: true, followers: rows1, following: rows2});

    }catch(err){
        console.log(err);
        res.json({isRetrieved: false, status: "Couldn't fetch data !!"})
    }
}

module.exports.updateProfileImage = async(req, res, next) => {
    try{
        const username = JSON.parse(Buffer.from(req.cookies.jwt.split('.')[1], 'base64').toString()).username;
        const user_id = getHash('user_id', username);

        const img_public_id = req.body.img_public_id;
        const img_folder_name = req.body.img_folder_name;
        const img_version = req.body.img_version;

        const connection = await pool.getConnection();
        const query = `UPDATE users SET img_public_id = '${img_public_id}', img_folder_name = '${img_folder_name}', img_version = '${img_version}' WHERE user_id = '${user_id}';`;
        const [result] = await connection.execute(query);
        
        connection.release();

        res.json({isUpdated: true});

    }catch(err){
        console.log(err);
        res.json({isUpdated: false, status: "Failed to update profile image"});
    }
}

module.exports.updateDescription = async(req, res, next) => {
    try{
        const username = JSON.parse(Buffer.from(req.cookies.jwt.split('.')[1], 'base64').toString()).username;
        const user_id = getHash('user_id', username);



        const connection = await pool.getConnection();
        const query = `UPDATE users SET description = ${connection.escape(req.body.description)} WHERE user_id = '${user_id}';`;
        const [result] = await connection.execute(query);
        
        connection.release();

        res.json({isUpdated: true});

    }catch(err){
        console.log(err);
        res.json({isUpdated: false, status: "Failed to update description"});
    }
}