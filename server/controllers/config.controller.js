const sequelize = require('../../sequelize');
const { Op } = require("sequelize");
const LocalChat = require('../utils/localChat');
const vk = require('../utils/vk')
let {user, config, uik, chat} = sequelize.models;

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

//utils
module.exports.utilities = async function utilities(req, res, next) {
  //vk group status
  const uiks = await uik.findAll()
  const notAssigned = uiks.filter(u=>u.vk_album_id === 0)
  const vkGroupStatus = {
    uiks: uiks.length,
    notAssigned: notAssigned.length
  }
  //telegram chats
  const chats = await chat.findAll()
  const tgChatsStatus = {
    //uiks.length should be equal chats.length
    chats: uiks.length,
    notAssigned: uiks.length - chats.length
  }
  res.send({status:true, data:{
    vkGroupStatus:vkGroupStatus,
    tgChatsStatus:tgChatsStatus
  }})
};
module.exports.genChats = async function genChats(req, res, next) {
  LocalChat.syncChats()
  res.send('done')
};

module.exports.genGroups = async function genGroups(req, res, next) {
  vk.syncAlbums()
  res.send('done')
};