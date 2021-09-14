const sequelize = require('../../sequelize/');
let {user,config} = sequelize.models;

exports.init = async (ctx) => {
    ctx.reply('enter admin tg password')
    return ctx.wizard.next();
}

exports.getPass = async (ctx) => {
    const password = await config.findAll({where:{
        name:'tg_admin_password'
    }})
    if(password.pop().value === ctx.update.message.text){
        user.update({
            role:1
        },{
            where:{
                chat_id:ctx.update.message.from.id
            }
        })
        ctx.reply('Вам выданы права администратора')
        ctx.scene.leave()
    }else{
        ctx.reply('Неверный пароль')
    }
}