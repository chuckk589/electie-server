const {Composer}        = require('telegraf')
const markups           = require('../../helpers/markups')
const bcrypt            = require('bcrypt');
const sequelize         = require('../../sequelize/');

let {user, stats, laCodes} = sequelize.models;

exports.start = (ctx) => {
    ctx.telegram.editMessageCaption(ctx.from.id, ctx.session.menuId, undefined, ctx.i18n.t('adminMenuGreet',{password:ctx.update.callback_query.from.id,login:ctx.update.callback_query.from.username}), markups.adminMenu(ctx.i18n)).catch(()=>{})
}