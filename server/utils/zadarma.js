
const sequelize = require('../../sequelize');
const { Op } = require("sequelize");
let {config} = sequelize.models;
const { api } = require("zadarma");

class Zadarma {
    constructor(){
        this.api = api
        config.findAll({where:{
            name:{
                [Op.or]: ['zadarma_key','zadarma_secret']
            }
        }}).then(r=>{
            process.env.ZADARMA_USER_KEY = r.find(e=>e.name == 'zadarma_key').value;
            process.env.ZADARMA_SECRET_KEY = r.find(e=>e.name == 'zadarma_secret').value;
        })
    }
    getWidgetCreds(){
        return new Promise((res,rej)=>{
            this.getFreeSip().then(sip => {
                console.log(sip)
                this.api({
                    api_method: '/v1/webrtc/get_key/',
                    params: {
                        sip: sip.number
                    }
                }).then(r => {
                   res({full_sip:`${sip.pbx_id}-${sip.number}`,...r})
                })
            })
        })
    }
    getFreeSip(){
        return new Promise((res,rej)=>{
            this.api({api_method: '/v1/pbx/internal/'}).then(async r=>{
                if(r.numbers){
                    for (const numb of r.numbers) {
                        const response = await this.api({api_method: `/v1/pbx/internal/${numb}/status/`})
                        console.log(response)
                        if(response.is_online === 'false'){
                            return res({pbx_id:response.pbx_id, number:numb})
                        }
                    }
                    return res(this.createNewSip())
                }
            })
        })
    }
    createNewSip() {
        return new Promise((res, rej) => {
            this.api({
                http_method: 'POST',
                api_method: '/v1/pbx/internal/create/',
                params: {
                    start_number: 'any',
                    quantity: 1
                }
            }).then(async r => {
                return res({pbx_id:r.pbx_id, number:r.numbers.pop()})
            })
        })
    }
    // zadarmaSort (obj)  {
    //     var ordered = {};
    //     Object.keys(obj).sort().forEach(function (key) {
    //         ordered[key] = obj[key];
    //     });
    //     return ordered;
    // }
    // async zadarmaRequest (method, params , type) {
    //     let sortedParams = this.zadarmaSort(params);
    //     let querry = httpBuildQuery(sortedParams);
    
    //     let md5 = crypto.createHash('md5').update(querry).digest('hex');
    //     let text = method + querry + md5;
    //     let hash = crypto.createHmac('sha1', '8e128d1f5ab5c81746e1').update(text).digest('hex');
    //     let sign = base64encode(hash);
    
    //     // создаем заголовок
    //     let Authorization = `${'76fdef1b053d5e22d3fe'}:${sign}`;
    //     console.log(`https://api.zadarma.com${method}?${querry}`,type,Authorization)
    //     let response = await this.$http({
    //         method:'GET',
    //         url:`https://api.zadarma.com${method}?${querry}`,
    //         headers: {
    //             'Authorization': Authorization
    //         },
    //     })
    //     return response;
    // }
}
const zd = new Zadarma()

module.exports = zd;