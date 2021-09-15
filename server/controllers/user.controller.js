const sequelize = require('../../sequelize');
// const utils = require('../utils/writer.js');
const fs = require('fs');

let {user, chat, uik} = sequelize.models;

module.exports.getUsers = async function getUsers(req, res, next) {
    const data = await user.findAll({include:{
        model:chat,
        include:[uik]
    }})
    res.send(data)
};

module.exports.updateUser = async function updateUser(req, res, next) {
    if(req.body){
        let {createdAt,updatedAt,chats,...rest} = req.body
        user.update(rest,{
            where:{
                id:rest.id
            }
        }).then(r=>{
            res.send('done')
        }).catch(r=>{
            res.send('something went wrong')
        })
    }
    
};
