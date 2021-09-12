
const WizardScene       = require('telegraf/scenes/wizard')


const adminMenuController   = require('./controllers/adminController')

exports.adminMenu = new WizardScene(
    'adminScene',
    adminMenuController.init,
    adminMenuController.getPass
    )
