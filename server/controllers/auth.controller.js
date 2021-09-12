const sequelize = require('../../sequelize');
const zadarma = require('../utils/zadarma')
let {user} = sequelize.models;
// const authorize = require('../utils/authorize')

module.exports.login = async function login(req, res, next) {
  const usr = await user.findOne({where:{chat_id:req.body.chat_id}, attributes:['role','chat_id','credentials','username']})
  if(usr){
    return res.send({status: true, user: usr});
  }else{
    return res.send({status: false});
  }
};

// module.exports.getGoogleAuthLink = async function getGoogleAuthLink(req, res, next) {
//   const url = authorize.getLink()
//   res.send({status:true,url:url})
// };

// module.exports.oauthcallback = async function oauthcallback(req, res, next) {
//   authorize.auth(req.query.code)
//   res.redirect('/')
// }

module.exports.logout = async function logout(req, res, next) {
  req.logout();
  return res.send();
};

module.exports.getZadarmaAuthKey = async function getZadarmaAuthKey(req, res, next){
  //let tariff = await zadarma.api({api_method: '/v1/pbx/internal/100/status/'});
  const zResponse = await zadarma.getWidgetCreds()
  //let tariff = await zadarma({api_method: '/v1/webrtc/get_key/', params: {sip: '100'}});
  res.send(zResponse)
}