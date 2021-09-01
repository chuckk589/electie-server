const sequelize = require('../../sequelize/');
const utils = require('../../helpers/utils')

let {user, stats, laCodes} = sequelize.models;

module.exports = async (ctx, next) => {
    const update =  {
        stepsAmount: 0,
        stepLastTime: Date.now(),
        stepBackAmount: 0,
        btnClicksAmount: 0,
        msgAmount: 0,
    }
    const chat_id = ctx.update.message?.from.id || ctx.update.callback_query?.from.id
    if(!chat_id){
        await next()
        return
    }
    if (ctx.update.message) {
        update.msgAmount++
        if (ctx.update.message.text == '/start') {
            const photos = await ctx.telegram.getUserProfilePhotos(chat_id)
            const langId = await laCodes.findOne({where: { value: 'ru' }})
            user.findOrCreate({
                where: {
                    chat_id: ctx.update.message.from.id,
                },
                defaults: {
                    laCodeId: langId.id,
                    username: ctx.update.message.from.username,
                    password: ctx.update.message.from.id.toString(),
                    profilePic: photos.total_count? await utils.tgGetPhoto(chat_id,photos.photos[0][0].file_id) : ''
                }
            }).then(res=>{
                const [instance, wasCreated] = res;
                if(wasCreated){
                    update.firstSeen =  Date.now()
                    update.userId = res[0].dataValues.id
                    stats.create(update)
                }
            })
            await next()
            return
        }
    } else if (ctx.update.callback_query) {
        update.btnClicksAmount++
        if (ctx.update.callback_query.data == 'next'){
            update.stepsAmount++
        }else if(ctx.update.callback_query.data == 'back'){
            update.stepBackAmount++
        }
    }
    stats.update({
        stepsAmount: sequelize.literal(`stepsAmount + ${update.stepsAmount}`),
        stepLastTime: update.stepLastTime,
        stepBackAmount: sequelize.literal(`stepBackAmount + ${update.stepBackAmount}`),
        btnClicksAmount: sequelize.literal(`btnClicksAmount + ${update.btnClicksAmount}`),
        msgAmount: sequelize.literal(`msgAmount + ${update.msgAmount}`),
    }, {
        individualHooks:true,
        where: {
            userId: sequelize.literal(`(SELECT id FROM users WHERE chat_id = ${chat_id})`)
        },
    })
    await next() // runs next middleware
}