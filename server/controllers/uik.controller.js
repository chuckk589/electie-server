const sequelize = require('../../sequelize');
const LocalChat = require('../utils/localChat');

// const authorize = require('../utils/authorize')

let {user, uik,uik_member,chat} = sequelize.models;

module.exports.getUiks = async function getUiks(req, res, next) {
  //temp
  const uiks = await uik.findAll({include:[chat,uik_member]})
  res.send(uiks)
};

module.exports.registerViolation = async function registerViolation(req, res, next) {
  LocalChat.onMessageTg({message:`Зарегистрировано нарушение - ${req.body.vidLink}`, ...req.body})
  res.send({status:true})
};
module.exports.updateUik = async function updateUik(req, res, next) {
  if(req.body){
      let {chat,uik_members ,chats,...rest} = req.body
      uik.update(rest,{
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
