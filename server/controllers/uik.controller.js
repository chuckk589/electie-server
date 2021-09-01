const sequelize = require('../../sequelize');
const utils = require('../utils/writer.js');
const fs = require('fs');

let {user} = sequelize.models;

module.exports.getUiks = async function getUiks(req, res, next) {
  //temp
  res.send([
    {
      id:329,
      name:'Территориальная избирательная комиссия Тверского района',
      address: '127051, город Москва, Цветной бульвар, дом 21, строение 8'
    },
    {
      id:330,
      name:'Территориальная избирательная комиссия Тверского района',
      address: '127051, город Москва, Цветной бульвар, дом 21, строение 8'
    },
    {
      id:331,
      name:'Территориальная избирательная комиссия Тверского района',
      address: '127051, город Москва, Цветной бульвар, дом 21, строение 8'
    }
  ])
};
