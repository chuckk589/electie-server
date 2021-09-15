const sequelize = require('../../sequelize');
const fs = require('fs');

let {uik_member} = sequelize.models;

module.exports.get = async function get(req, res, next) {
    const data = await uik_member.findAll()
    res.send(data)
};

module.exports.put = async function put(req, res, next) {
    if(req.body){
        uik_member.update(req.body,{
            where:{
                id:req.body.id
            }
        }).then(r=>{
            res.send('done')
        }).catch(r=>{
            res.send('something went wrong')
        })
    }
};
