const {Telegraf}        = require('telegraf')
const sequelize = require('../sequelize');
let {user,chat,uik} = sequelize.models;
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
        const telegram_id = ctx.update.message.chat.id.toString().substring(1);
        //TODO fetch uik from db?
        const body = {
            message:ctx.update.message.text,
            telegram_id:telegram_id,
            // uik: ctx.update.message.chat.title.split('№').pop().trim(),
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
        include:{
            model: chat,
            include: [uik]
        },
        defaults: {
            credentials: credentials,
            username: username,
            chat_id: chat_id
        }
    }).then(res=>{
        const [instance, wasCreated] = res;
        if(wasCreated){
            LocalChat.newChatAssignment(instance.id).then(e=>{
                ctx.reply(`Ваш УИК № ${e.uik.uik_id}\nСсылка на чат: ${e.inviteLink}\nПароль для входа в ЛК: ${chat_id}`)
            })
        }else{
            if(instance.chats.length){
                let reply = instance.chats.reduce((sum,cur)=>{
                    sum += `    УИК № ${cur.uik.uik_id}\n   Ссылка на чат: ${cur.inviteLink}\n\n`
                    return sum
                },'Список ваших УИКов:\n')
                reply+=`Пароль для входа в ЛК: ${chat_id}`
                ctx.reply(reply)
            }else{
                ctx.reply('Каким то образом вы не определены ни в один УИК')
            }
        }
    })
})

bot.launch()
