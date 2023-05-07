require('dotenv').config();
const {pool} = require('../Database/connection.js');
const crypto = require('crypto');
require('dotenv').config();

const getHash = (secretValue, hashSource, algorithm = 'sha256') => {
    const hmac = crypto.createHmac(algorithm, secretValue);
    hmac.update(hashSource);
    return hmac.digest('hex');
}

module.exports.createGroup = async(req, res, next) => {
    console.log(req.body);
    try{
        const {groupname, description, img_public_id, img_folder_name, img_version, tags} = req.body;
        const username = JSON.parse(Buffer.from(req.cookies.jwt.split('.')[1], 'base64').toString()).username;
        const owner_id = getHash('user_id', username);

        const group_id = getHash('group_id', req.body.groupname);

        const connection = await pool.getConnection();
        const query1 = `INSERT INTO groups(group_id, owner_id, groupname, description, img_public_id, img_folder_name, img_version, member_count) VALUES('${group_id}', '${owner_id}', '${groupname}', ${connection.escape(description)} ,'${img_public_id}', '${img_folder_name}', '${img_version}', ${tags.length + 1} );`;
        let [result] = await connection.execute(query1);

        let query2;
        if(req.body.groupType === 'private'){
            query2 = `INSERT INTO private_groups(group_id) VALUES('${group_id}');`
        }else{
            query2 = `INSERT INTO public_groups(group_id) VALUES('${group_id}');`;   
        }
        [result] = await connection.execute(query2);

        if(tags.length){
            for(let tag of tags){
                const user_id = getHash('user_id', tag);
                req.body.groupType ||= 'public';
                const query3 = `INSERT INTO user_groups(group_id, user_id, group_type) VALUES('${group_id}', '${user_id}', '${req.body.groupType}');`;
                [result] =  await connection.execute(query3);
            }
        }

        connection.release();

        res.json({isCreated: true, status: 'Group created', groupname});

    }catch(err){
        console.log(err);
        res.json({isCreated : false, status: "Couldn't create group"});
    }
}

module.exports.retreiveGroupData = async(req, res, next) => {
    console.log(req.body);
    try{
        const username = JSON.parse(Buffer.from(req.cookies.jwt.split('.')[1], 'base64').toString()).username;
        const user_id = getHash('user_id', username);
        const group_id = getHash('group_id', req.params.groupname);

        let groupAssociation = [0, 0];
        
        const connection = await pool.getConnection();
        const query1 = `SELECT count(*) FROM public_groups WHERE group_id = '${group_id}';`
        const [rows1, field1] = await connection.execute(query1);
        groupAssociation[1] = (rows1.length); // 1 -> Group is public and exists,  0 -> Group does not exist or Group is private

        const query2 = `SELECT 1 AS is_member from user_groups where user_id = '${user_id}' AND group_id = '${group_id}';`;
        const [rows2, field2] = await connection.execute(query2);
        groupAssociation[0] = rows2.length;
        groupAssociation.join('');

        if(groupAssociation === '00'){
            connection.release();
            res.json({isNotFound: true});
            return;
        }
        
        const query3 = `SELECT groupname, description, img_folder_name, img_public_id, img_version, member_count, created_at from groups where group_id = '${group_id}';`;
        console.log(query3);
        const [rows3, field3] = await connection.execute(query3);
        
        const query4 = `SELECT (select username from users where user_id = user_groups.user_id) as username from user_groups where group_id = '${group_id}';`;
        console.log(query4);
        const [rows4, fields4] = await connection.execute(query4);
        
        /*  Fetch group posts */
        connection.release();
        
        res.json({isFetched: true, ...rows3[0], isMember: groupAssociation === '01' ? false : true, users: rows4});
        return;
        
    }catch(err){
        console.log(err);
        res.json({isFetched : false, status : "Couldn't fetch group data"});
    }
}

module.exports.getNotifications = async(req, res, next) => {
    try{
        const username = JSON.parse(Buffer.from(req.cookies.jwt.split('.')[1], 'base64').toString()).username;
        const user_id = getHash('user_id', username);
        
        const connection = await pool.getConnection();
        const query = `SELECT status, message, time_stamp from notifications where user_id = '${user_id}' order by time_stamp desc;`;
        const [rows, fields] = await connection.execute(query);
        connection.release();

        console.log(rows);
        res.json({isFetched : true, notifications : rows});
        
    }catch(err){
        console.log(err);
        res.json({isFetched : false, notifications : rows});
    }
}


module.exports.deleteNotifications = async(req, res, next) => {
    try{
        const username = JSON.parse(Buffer.from(req.cookies.jwt.split('.')[1], 'base64').toString()).username;
        const user_id = getHash('user_id', username);
        
        const connection = await pool.getConnection();
        const query = `DELETE FROM notifications where user_id = '${user_id}';`;
        const [result] = await connection.execute(query);
        connection.release();

        console.log(rows);
        res.json({isDeleted : true});
        
    }catch(err){
        console.log(err);
        res.json({isDeleted : true});
    }
}