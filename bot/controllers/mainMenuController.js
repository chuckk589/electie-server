const markups           = require('../../helpers/markups')
const {Composer}        = require('telegraf')
const { Extra, Markup } = require('telegraf')



exports.start = async (ctx) => {
    // return ctx.telegram.editMessageCaption(ctx.from.id,ctx.session.menuId,undefined,mainMenuInlineModeMsg(ctx, 0), markups.mainMenuStep1Inline(ctx.i18n))
    return ctx.telegram.editMessageCaption(ctx.from.id, ctx.session.menuId, undefined, ctx.i18n.t('mainMenuGreet'), markups.mainMenu(ctx.i18n))
}
exports.sendController = async (ctx) => {
    ctx.session.mediaGroup = ctx.session.mediaGroup || []
    if(ctx.update.callback_query.data == 'sendPhoto'){
        ctx.replyWithPhoto({source: './files/bot/sendPhoto.png' }).then(e=>ctx.session.mediaGroup.push(e.message_id))
    }else if(ctx.update.callback_query.data == 'sendAudio'){
        ctx.replyWithAudio({source: './files/bot/MJ_billie_jean.mp3' }).then(e=>ctx.session.mediaGroup.push(e.message_id))
    }else if(ctx.update.callback_query.data == 'sendDocument'){
        ctx.replyWithDocument({source: './files/bot/imEmpty.rar' }).then(e=>ctx.session.mediaGroup.push(e.message_id))
    }else if(ctx.update.callback_query.data == 'sendVideo'){
        ctx.replyWithVideo({source: './files/bot/MJ_billie_jean.mp4' }).then(e=>ctx.session.mediaGroup.push(e.message_id))
    }else if(ctx.update.callback_query.data == 'sendAnimation'){
        ctx.replyWithAnimation({source: './files/bot/giphy.gif' }).then(e=>ctx.session.mediaGroup.push(e.message_id))
    }else if(ctx.update.callback_query.data == 'sendVoice'){
        ctx.replyWithVoice({source: './files/bot/MJ_billie_jean.mp4'}).then(e=>ctx.session.mediaGroup.push(e.message_id))
    }else if(ctx.update.callback_query.data == 'sendContact'){
        ctx.replyWithContact('+123456789','Vasya','Pupkin').then(e=>ctx.session.mediaGroup.push(e.message_id))
    }else if(ctx.update.callback_query.data == 'sendPoll'){
        ctx.replyWithPoll('Кто если не Путин?',['Путин','Нэвэльный'],{type:"quiz",correct_option_id:0}).then(e=>ctx.session.mediaGroup.push(e.message_id))
    }else if(ctx.update.callback_query.data == 'sendLocation'){
        ctx.replyWithLocation(60,-135).then(e=>ctx.session.mediaGroup.push(e.message_id))
    }
    return ctx.answerCbQuery()
}
exports.cleanUp = async (ctx) => {
    if(ctx.session.mediaGroup){
        ctx.session.mediaGroup.forEach(async element => {
            await ctx.deleteMessage(element).catch(()=>{})
        });
        ctx.session.mediaGroup = []
    }
    return ctx.answerCbQuery()
}
function selfDestructCB (msg,ctx){
    console.log(msg,ctx)
    let time = 4
    const int = setInterval(() => {
        if(time==0) clearInterval(int)
        ctx.telegram.editMessageCaption(ctx.from.id, msg.message_id, undefined, ctx.i18n.t('mediaCaption',{seconds:time--}))
    }, 1000);
    setTimeout(() => {
        ctx.deleteMessage(msg.message_id).catch(()=>{})
    }, 5000 + 200);
}