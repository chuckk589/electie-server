const sequelize = require('../../sequelize');
let {user} = sequelize.models;

module.exports.login = async function login(req, res, next) {
  const usr = await user.findOne({where:{chat_id:req.body.chat_id}, attributes:['chat_id','credentials','username']})
  return res.send({status: !!usr, user: usr});
};


module.exports.logout = async function logout(req, res, next) {
  req.logout();
  return res.send();
};

module.exports.status = async function status(req, res, next) {
  req.logout();
  return res.send();
};
