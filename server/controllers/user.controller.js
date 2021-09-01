const sequelize = require('../../sequelize');
const utils = require('../utils/writer.js');
const fs = require('fs');

let {user} = sequelize.models;

module.exports.getUsers = async function getUsers(req, res, next) {
  const menuId = +req.params.id
  if(!Number. isInteger(menuId)) return next()
  if (menuId === 0) {
    const data = await user.findAll({attributes: ['credentials','id','statusId','username','passwordClean']})
    utils.writeJson(res, data)
  }else{
    // const stat = await stats.findOne({where:{userId:userId},attributes: {exclude: ['id','stepsSum']}})
    // stat?
    //   utils.writeJson(res, stat):
    //   utils.writeJson(res, {message:'Запись не найдена'},404)
  }
};
