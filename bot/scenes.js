const TelegrafI18n      = require('telegraf-i18n')
const Stage             = require('telegraf/stage')
const Scene             = require('telegraf/scenes/base')
const WizardScene       = require('telegraf/scenes/wizard')


const { match, reply }          = TelegrafI18n
const { enter, leave, reenter } = Stage

const mainMenuController   = require('./controllers/mainMenuController')
const langMenuController   = require('./controllers/langController')
const BtnsMenuController   = require('./controllers/BtnsController')
const RegMenuController   = require('./controllers/regController')


exports.LangMenu = new Scene('LangMenu')
    .enter(langMenuController.start)
    .on('callback_query',langMenuController.setLang)
    .action('next', enter('LangMenu'))
   
exports.mainMenu = new Scene('mainMenu')
    .enter(mainMenuController.start)
    .action(/send/, mainMenuController.sendController)
    .action('deleteAll', mainMenuController.cleanUp)
    .action('next', enter('BtnsMenu'))
    .action('back', enter('LangMenu'))

exports.BtnsMenu = new Scene('BtnsMenu')
    .enter(BtnsMenuController.start)
    .action(/radio|checkbox/, BtnsMenuController.InputHandler)
    .action('PBreboot', reenter('BtnsMenu'))
    .action('next', enter('RegMenu'))
    .action('back', enter('mainMenu'))

exports.RegMenu = new Scene('RegMenu')
    .enter(RegMenuController.start)
    .action('back', enter('BtnsMenu'))
// exports.regScene = new WizardScene(
//     'regScene',
//     regController.init,
//     regController.getPhone,
//     regController.getEmail,
//     regController.getCity,
//     regController.getPromo,
//     regController.getName,
//     regController.getSName)
//     .hears(match('back'), enter('mainMenu'))

// exports.changeLang = new WizardScene(
//     'changeLang', 
//     langController.start,
//     langController.setLang)
//     .hears(match('back'), enter('mainMenu'))

// exports.loginScene = new WizardScene(
//     'loginScene', 
//     loginController.init,
//     loginController.getPhone)
//     //loginController.getEmail,
//     //loginController.getPassword)
//     .hears(match('back'), enter('mainMenu'))

// exports.protMenu = new Scene('protMenu')
//     .enter(protMenuController.start)
//     .hears(match('menu2_1'), enter('uploadScene'))
//     .hears(match('menu2_2'), protMenuController.rules)
//     .hears(match('menu2_3'), protMenuController.about)
//     .hears(match('menu2_4'), protMenuController.myChecks)
//     .hears(match('menu2_5'), protMenuController.myPrizes)
//     .hears(match('menu2_6'), protMenuController.winners)
//     .hears(match('menu2_7'), protMenuController.contact)
    
// exports.uploadScene = new Scene('uploadScene')
//     .enter(protMenuController.uploadSceneStart)
//     .on('photo',protMenuController.getFile)
//     .hears(match('back'), enter('protMenu'))