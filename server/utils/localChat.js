
const { Server } = require("socket.io");
const sequelize = require('../../sequelize');
const axios = require('axios')
let {user,chat,uik } = sequelize.models;

class LocalChat {
    async init(app){
        this.io = new Server(app);
        this.io.on('connection', this.onConnection)
        // setInterval(() => {
        //     console.log(`LocalChat: executing syncChats`)
        //     this.syncChats()
        // }, 24*60*60*1000);
    }
    onConnection = (socket) => {
        //console.log(socket.handshake.query)
        if(socket.handshake.query.telegram_id){
            socket.join(socket.handshake.query.telegram_id);
            socket.on('message', this.onMessageTg)
        }else{
            socket.disconnect(true)
        }
    }
    newChatAssignment = async (id) =>{
        const chats = await chat.findAll({
            include: [user,uik]
        })
        const emptiestChat = chats.sort((a,b)=>{
            return a.users.length - b.users.length
        })[0]
        emptiestChat.addUser([id])
        return emptiestChat
    }
    onMessageDefault = (body) =>{
        //console.log(body)
        this.io.to(body.telegram_id).emit('chatMessage', body);
    }
    onMessageTg = (body) =>{
        this.io.to(body.chat.telegram_id.toString()).emit('chatMessage', body);
        const message = encodeURIComponent(`${body.user.username}: ${body.message}`)
        axios.post(`https://api.telegram.org/bot${process.env.tg_bot_api_key}/sendMessage?chat_id=-${body.chat.telegram_id}&text=${message}`)
    }
    syncChats = async () =>{
        const uiks = await uik.findAll({include:[chat]})
        for (const uk of uiks) {
            if(!uk.chat){
                const basicChat = await axios.post('https://api.t-a-a-s.ru/client', {
                    "api_key": process.env.taas_api_key,
                    "@type": "createNewBasicGroupChat",
                    "user_ids": [`${process.env.tg_bot_api_key.split(':').shift()}`],
                    "title" : `Чат по УИК №${uk.uik_id}`
                }).catch(er=>console.log(`LocalChat:syncChats ${er.response.data.error}`))
                if(!basicChat) return
                console.log(basicChat.data)
                const inviteLink = await axios.post('https://api.t-a-a-s.ru/client', {
                    "api_key": process.env.taas_api_key,
                    "@type": "generateChatInviteLink",
                    "chat_id": `-${basicChat.data.type.basic_group_id}`,
                }).catch(er=>console.log(`LocalChat:syncChats ${er.response.data.error}`))
                if(!inviteLink) return
                console.log(inviteLink.data)
                await chat.create({
                    telegram_id:basicChat.data.type.basic_group_id,
                    uikId:uk.id,
                    name:`Чат по УИК №${uk.uik_id}`,
                    inviteLink:inviteLink.data.invite_link
                })
                console.log(`LocalChat:syncChats Чат по УИК №${uk.uik_id} processed!`)
            }
        }
        console.log(`LocalChat:syncChats all chats exists , no need for sync`)
    }
}
const localchat = new LocalChat()

module.exports = localchat;