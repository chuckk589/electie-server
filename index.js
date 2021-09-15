require('dotenv').config()
require('./server/utils/configLoader')().then(res=>{
    require('./server/index')
    require('./bot/bot')
})