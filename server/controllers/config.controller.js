const sequelize = require('../../sequelize');
const { Op } = require("sequelize");
let {user, config} = sequelize.models;


// async function googleInit(cb){
//   const conf = await config.findAll({where:{
//     name:{
//       [Op.or]: ['google_api_client_id','google_api_client_secret','google_api_callback_ip']
//     }
//   }})
//   const secret = conf.find(e=>e.name == 'google_api_client_secret').value
//   const client_id = conf.find(e=>e.name == 'google_api_client_id').value
//   const host = conf.find(e=>e.name == 'google_api_callback_ip').value
//   cb(null, new google.auth.OAuth2(client_id,secret,`${host}/v1/config/oauthcallback`));
// }
// {
//   access_token: 'ya29.a0ARrdaM_vgiN-4Lme3isoFSBKJvp2BzmbWFCC6UxQr_7Y6f2k3AbiScrsSD3sCK_-0hfgdaJDjjAcjLhIc0-kkwg5dbH6jWHc4GeiDWfIS_YBWjSx7X9GL-pnzKSZ-1I3AkZRWSOyXyOAkDsgSmvO6CHdepli',
//   refresh_token: '1//0chtTZqDWST3lCgYIARAAGAwSNwF-L9IrbxxboN1XI7rXDuamj6eBkBNCsb80j_2PeNDErosK9r7ejxUzk-fzMzc7h7LTvdCkQmU',
//   scope: 'https://www.googleapis.com/auth/youtube.upload',
//   token_type: 'Bearer',
//   expiry_date: 1630693870431
// }

module.exports.applyConfig = async function applyConfig(req, res, next) {
  //temp
  process.exit()
};
module.exports.getConfigs = async function getConfigs(req, res, next) {
    //temp
    const configs = await config.findAll()
    res.send({status:true, config:configs})
  };
module.exports.setConfigs = async function setConfigs(req, res, next) {
  //temp
  config.update({
    value:req.body.value
  },{
    where:{
      id:req.body.id
    }
  })
  .then(e=>res.send({status:true}))
  .catch(e=>res.send(e))
};