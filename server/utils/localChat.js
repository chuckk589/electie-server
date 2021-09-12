
const { Server } = require("socket.io");
const sequelize = require('../../sequelize');
const axios = require('axios')
let {chat} = sequelize.models;

class LocalChat {
    async init(app){
        this.io = new Server(app);
        this.io.on('connection', this.onConnection)
    }
    onConnection = (socket) => {
        if(socket.handshake.query.uik_id){
            this.checkChat(socket.handshake.query.uik_id)
            socket.join(socket.handshake.query.uik_id);
            socket.on('message', this.onMessageTg)
        }else{
            socket.disconnect(true)
        }
    }
    onMessageDefault = (body) =>{
        this.io.to(body.uik).emit('chatMessage', body);
    }
    onMessageTg = (body) =>{
        console.log(body)
        this.io.to(body.chat.uikId.toString()).emit('chatMessage', body);
        const message = encodeURIComponent(`${body.user.username}: ${body.message}`)
        axios.post(`https://api.telegram.org/bot${process.env.tg_bot_api_key}/sendMessage?chat_id=-${body.chat.telegram_id}&text=${message}`)
    }
    checkChat = async (id) =>{
        const c = await chat.findOne({where:{uikId:id}})
        if(!c){
            axios.post('https://api.t-a-a-s.ru/client', {
                "api_key": process.env.taas_api_key,
                "@type": "createNewBasicGroupChat",
                "user_ids": [`${process.env.tg_bot_api_key.split(':').shift()}`],
                "title" : `Чат по УИК ${id}`
            }).then(e=>{
                axios.post('https://api.t-a-a-s.ru/client', {
                "api_key": process.env.taas_api_key,
                "@type": "generateChatInviteLink",
                "chat_id": `-${e.data.type.basic_group_id}`,
                }).then(e2=>{
                    chat.create({
                        telegram_id:e.data.type.basic_group_id,
                        uikId:id,
                        name:`Чат по УИК ${id}`,
                        inviteLink:e2.data.invite_link
                    })
                }).catch(e=>console.log(e))
            }).catch(e=>console.log(e))
        }
    }
}
const localchat = new LocalChat()

module.exports = localchat;