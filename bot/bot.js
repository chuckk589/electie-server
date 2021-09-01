const {Telegraf}        = require('telegraf')
const sequelize = require('../sequelize');
let {user} = sequelize.models;
const LocalChat = require('../server/utils/localChat');
// const session           = require('telegraf/session');
// const TelegrafI18n      = require('telegraf-i18n')
// const Stage             = require('telegraf/stage')
// const path              = require("path");
// const scenes            = require('./scenes')
// const {CustomContext}   = require('../helpers/telegrafCustom')
// const middleware        = require('./middlewares')

const bot = new Telegraf('1958915532:AAHjWe_9SY2GXzEllJeKjtTO6t5y2ojfjJw')
// const i18n = new TelegrafI18n({useSession: true, defaultLanguage: 'ru', allowMissing: true, directory: path.resolve(__dirname, 'locales')})
// const stage = new Stage([
//     scenes.mainMenu,
//     scenes.LangMenu,
//     scenes.BtnsMenu,
//     scenes.RegMenu])
    
// bot.use(session());
// bot.use(middleware.stepsCounter);
// bot.use(i18n.middleware())
// bot.use(stage.middleware())

// configure middleware


bot.on('text', async (ctx, next)=>{
    const type = ctx.update.message.chat.type
    if(type === 'private'){
        const chat_id =  ctx.update.message.from.id
        const username = ctx.update.message.from.username
        const credentials = ctx.update.message.from.first_name
        user.findOrCreate({
            where: {
                chat_id: ctx.update.message.from.id,
            },
            defaults: {
                credentials: credentials,
                username: username,
                chat_id: chat_id
            }
        }).then(res=>{
            const [instance, wasCreated] = res;
            const reply = wasCreated? `New user successfully created!\nYou can now log in with following id : ${chat_id}`: `Already registered\nYour id is: ${chat_id}`
            ctx.reply(reply)
        })
    }else if(type === 'group'){
        const id = ctx.update.message.chat.id.toString().substring(1);
        //TODO fetch uik from db?
        const body = {
            message:ctx.update.message.text,
            uik: ctx.update.message.chat.title.split(' ').pop(),
            user:{
                username:ctx.update.message.from.first_name,
                chat_id:ctx.update.message.from.id
            }
        }
        LocalChat.onMessageDefault(body)
    }
    
    next()
})

// bot.on('message', async (ctx)=>{
//     console.log(ctx)
//     //ctx.reply(228)
// })
bot.launch()
