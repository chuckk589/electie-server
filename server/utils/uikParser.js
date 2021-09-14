const axios = require('axios')
const parse = require('csv-parse')
const fs = require('fs')
const cheerio = require('cheerio');
const sequelize = require('../../sequelize');
const Iconv = require('iconv').Iconv;
let {uik,uik_member} = sequelize.models;

module.exports = function(){
    return new Promise((res,rej)=>{
        let uiks = {}
        const file =  fs.readFileSync('./server/utils/uikParser/uik_data.csv', 'utf8')
        parse(file, {columns: true}, async (err, output) =>{
            output.forEach(o=>{
                if(o['УИК по ТИКам'].includes('ТИК')){
                    console.log(`skipping ${o['УИК по ТИКам']}`)
                }else{
                    const uikNumber =  o['УИК по ТИКам'].split('№').pop()
                    uiks[uikNumber] = o['Ссылка на сайт ИК СПб']
                }
            })
            for (const ui in uiks) {
                const data = await axios({
                    method:'GET',
                    url:uiks[ui],
                    responseType: 'arraybuffer',
                    responseEncoding: 'binary'
                })
                const $ = cheerio.load(Iconv('windows-1251', 'utf8').convert(data.data).toString());
                let members = []
                $('#main > div > div.center-colm > div.table.margtab > table > tbody > tr').each((i,element) =>{
                    if(i!==0){
                        let member = {}
                        $(element).find("td").each((i,e)=>{
                            if(i===1){
                                member.credential = $(e).text()
                            }else if(i===2){
                                member.status = $(e).text()
                            }else if(i===3){
                                member.proposedBy = $(e).text()
                            }
                        });
                        members.push(member)
                    }
               });
                const query = {
                    uik_id:+ui,
                    address: $('#address_ik').text().trim(),
                    phone: $('#map_block_ik +p').text().split(':').pop().trim(),
                    email:$('#main > div > div.center-colm > p:nth-child(7)').text().split(':').pop().trim(),
                    exp:$('#main > div > div.center-colm > p:nth-child(8)').text().split(':').pop().trim(),
                    uik_members: members
                }
                await uik.create(query,{
                    include: [uik_member]
                });
                console.log(`uik ${+ui} done!`)
                //const url = `https://api.vk.com/method/video.addAlbum?v=5.52&access_token=${process.env.vk_access_token}&group_id=${process.env.vk_video_group_id}&title=УИК №${+ui}`
                // await axios.post(encodeURI(url))
                // .then(e => {
                    // const query = {
                    //     uik_id:+ui,
                    //     address: $('#address_ik').text().trim(),
                    //     phone: $('#map_block_ik +p').text().split(':').pop().trim(),
                    //     email:$('#main > div > div.center-colm > p:nth-child(7)').text().split(':').pop().trim(),
                    //     exp:$('#main > div > div.center-colm > p:nth-child(8)').text().split(':').pop().trim(),
                    //     vk_album_id:e.data.response.album_id,
                    //     uik_members: members
                    // }
                    
                //     console.log(`uik ${+ui} done!`)
                // })
                // .catch(e=>rej(e))
            }
            res('done')
        })
    })
}