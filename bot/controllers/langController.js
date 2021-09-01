const {Composer}        = require('telegraf');
const markups           = require('../../helpers/markups')
const sequelize         = require('../../sequelize/');

let {user, stats, laCodes} = sequelize.models;

exports.start = async (ctx) => {
    if(ctx.session.menuId){
        // return ctx.telegram.editMessageText(ctx.from.id,ctx.session.menuId,undefined,ctx.i18n.t('langMenu1'), markups.langMenu(ctx.i18n)).catch(()=>{})
        await ctx.deleteMessage(ctx.session.menuId).catch(()=>{})
    }
    await ctx.replyWithPhoto({source: './files/bot/main.png' }, markups.langMenu(ctx.i18n)).then((r)=>{
        ctx.session.menuId = r.message_id
        //ctx.scene.enter('RegMenu')
    });
}
exports.setLang = async (ctx) => {
    let callback_query = ctx.update.callback_query.data
    if(callback_query=='next'){
        return ctx.scene.enter('mainMenu');
    }else if(callback_query=='langfile'){
        return ctx.replyWithDocument({
            source: `./bot/locales/${ctx.i18n.locale()}.json`,
            filename: `${ctx.i18n.locale()}.txt`
        })
    }else{
        const langKey = callback_query.slice(-2)
        const langId = await laCodes.findOne({where:{value:langKey}})
        user.update({laCodeId:langId.id},{where: {chat_id: ctx.update.callback_query.from.id}})
        if(langKey.toLowerCase() != ctx.i18n.locale()){
            ctx.i18n.locale(langKey.toLowerCase())
            return ctx.telegram.editMessageCaption(ctx.from.id, ctx.session.menuId, undefined, ctx.i18n.t('greet'), markups.langMenu(ctx.i18n))
        }
    }
    return ctx.answerCbQuery()
}