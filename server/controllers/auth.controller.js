const sequelize = require('../../sequelize');
const zadarma = require('../utils/zadarma')
let {user, chat, uik ,uik_member} = sequelize.models;
// const authorize = require('../utils/authorize')

module.exports.login = async function login(req, res, next) {
  if(req?.body?.chat_id){
    const usr = await user.findOne({
      where:{chat_id:req.body.chat_id},
      include:{
        model:chat,
        include: {
          model:uik,
          include:[uik_member]
        }
      },
      attributes:['role','chat_id','credentials','username']})
    if(usr){
      return res.send({status: true, user: usr});
    }else{
      return res.send({status: false});
    }
  }else{
    return res.send({status: 'Incorrect request'});
  }
};

module.exports.logout = async function logout(req, res, next) {
  req.logout();
  return res.send();
};

module.exports.getZadarmaAuthKey = async function getZadarmaAuthKey(req, res, next){
  const zResponse = await zadarma.getWidgetCreds()
  res.send(zResponse)
}