const {Telegraf}        = require('telegraf')
const sequelize = require('../sequelize');
let {user} = sequelize.models;
const LocalChat = require('../server/utils/localChat');
const session           = require('telegraf/session');
const Stage             = require('telegraf/stage')
const scenes            = require('./scenes')

const bot = new Telegraf(process.env.tg_bot_api_key)
const stage = new Stage([
    scenes.adminMenu
])
    
bot.use(session());
bot.use(stage.middleware())

// configure middleware

bot.command('/setadmin', async (ctx)=>{
    ctx.scene.enter('adminScene')
})

bot.on('text', async (ctx, next)=>{
    const type = ctx.update.message.chat.type
    if(type === 'group'){
        console.log(ctx.update.message.chat.id)
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

bot.start((ctx) =>{
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
})

bot.launch()
