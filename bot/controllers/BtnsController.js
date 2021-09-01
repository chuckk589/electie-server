const markups = require('../../helpers/markups')
const qiwi = require('../../helpers/qiwi')

exports.start = async (ctx) => {
    ctx.session.ButtonGroup = ctx.session.ButtonGroup || {
        radio: 'radio1',
        checkbox: ['checkbox1'],
        qw : await qiwi.getBaseLink('qw'),
        card: await qiwi.getBaseLink('card')
    }
    await ctx.ProgressBar({color: -1, max: 12, header: ctx.i18n.t('BtnMenuLoad')}, { messageId:ctx.session.menuId})
    ctx.telegram.editMessageCaption(ctx.from.id, ctx.session.menuId, undefined, ctx.i18n.t('btnMenuGreet'), markups.ButtonGroup(ctx.i18n,ctx.session.ButtonGroup))
    return ctx.answerCbQuery()
}

exports.InputHandler = async (ctx) => {
    const callback_query = ctx.update.callback_query.data
    const type = callback_query.slice(0, callback_query.length - 1)
    const duplicate = ctx.session.ButtonGroup[type].indexOf(callback_query)
    if (type == 'radio') {
        ctx.session.ButtonGroup[type] = callback_query;
    } else if (duplicate === -1) {
        ctx.session.ButtonGroup[type].push(callback_query);
    } else {
        ctx.session.ButtonGroup[type].splice(duplicate, 1)
    }
    ctx.telegram.editMessageCaption(ctx.from.id, ctx.session.menuId, undefined, ctx.i18n.t('btnMenuGreet'), markups.ButtonGroup(ctx.i18n, ctx.session.ButtonGroup)).catch(()=>{})
    return ctx.answerCbQuery()
}

// exports.getPhone = async (ctx) => {
//     if(ctx.updateSubTypes.includes('contact')){
//         const phoneNumber = parsePhoneNumber(ctx.update.message.contact.phone_number, 'RU').nationalNumber
//         let [r,e] = await db.exc(`SELECT COUNT(1) count FROM users WHERE phone = '${phoneNumber}'`)
//         if(r[0].count){
//             ctx.session.authed  = true
//             db.exc(`UPDATE users SET chat_id = ${ctx.message.from.id} WHERE phone = '${phoneNumber}'`)
//             await ctx.reply(`${ctx.i18n.t('authMenu')}\n\n${ctx.i18n.t('authMenuOnce')}`)
//             await ctx.replyWithPhoto({ source: './helpers/media/assist.jpg' });
//         }else{
//             ctx.state.customMsg = ctx.i18n.t('authFail')

//         }
//         return ctx.scene.enter('mainMenu');
//     }
//     else{
//         ctx.reply(ctx.i18n.t('errPhone'));
//         return
//     }
// }
// exports.getPassword = async (ctx) => {
//     //auth function
//     let [r,e] = await db.exc(`SELECT password_hash,chat_id FROM users WHERE phone = '${ctx.wizard.state.phone}'`)
//     if(r.length){
//         const match = await bcrypt.compare(ctx.message.text, r[0].password_hash.replace('$2y$','$2b$'));
//         if(match){
//             if(!r[0].chat_id){
//                 db.exc(`UPDATE users SET chat_id = ${ctx.message.from.id} WHERE phone = '${ctx.wizard.state.phone}'`)
//             }
//             ctx.session.authed  = true
//             return ctx.scene.enter('mainMenu');
//         }else{
//             ctx.reply(ctx.i18n.t('authFail'));
//         }
//     }else{
//         ctx.reply(ctx.i18n.t('authFail'));
//     }

// }