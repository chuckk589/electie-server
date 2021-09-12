const sequelize = require('../../sequelize');
const {config} = sequelize.models;

module.exports = function(){
    return new Promise((res,rej)=>{
        config.findAll()
        .then(cfgs=>{
            cfgs.forEach(cfg => {
                process.env[cfg.name] = cfg.value
            });
            res()
        })
        .catch(er=>rej(er))
    })
}