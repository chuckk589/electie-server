
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
        console.log(this.io.sockets.adapter.rooms)
        if(socket.handshake.query.uik_id){
            this.checkChat(socket.handshake.query.uik_id, socket)
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
        this.io.to(body.uik).emit('chatMessage', body);
        const message = encodeURIComponent(`${body.user.username}: ${body.message}`)
        axios.post(`https://api.telegram.org/bot1958915532:AAHjWe_9SY2GXzEllJeKjtTO6t5y2ojfjJw/sendMessage?chat_id=-${body.telegram_id}&text=${message}`)
    }
    checkChat = async (id, socket) =>{
        const c = await chat.findOne({where:{uik_id:id}})
        if(!c){
            axios.post('https://api.t-a-a-s.ru/client', {
                "api_key": "79627194543:stuR_PwCoERsQPA42mW4dbWkz3xUyvsLY3ahLs-G",
                "@type": "createNewBasicGroupChat",
                "user_ids": [1958915532],
                "title" : `Чат по УИК ${id}`
            }).then(e=>{
                axios.post('https://api.t-a-a-s.ru/client', {
                "api_key": "79627194543:stuR_PwCoERsQPA42mW4dbWkz3xUyvsLY3ahLs-G",
                "@type": "generateChatInviteLink",
                "chat_id": `-${e.data.type.basic_group_id}`,
                }).then(e2=>{
                    chat.create({
                        telegram_id:e.data.type.basic_group_id,
                        uik_id:id,
                        name:`Чат по УИК ${id}`,
                        inviteLink:e2.data.invite_link
                    })
                    socket.emit('chatInfo', {telegram_id:e.data.type.basic_group_id})
                }).catch(e=>console.log(e))
            }).catch(e=>console.log(e))
        }else{
            socket.emit('chatInfo', c)
        }
    }
}
const localchat = new LocalChat()

module.exports = localchat;