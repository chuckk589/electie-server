const sequelize = require('../../sequelize');
const axios = require('axios')
let {uik} = sequelize.models;

class VK {
    syncAlbums = async ()=>{
        //to trigger sync drop vk_album_id
        const uiks = await uik.findAll()
        for (const uk of uiks) {
            if(uk.vk_album_id === 0){
                const url = `https://api.vk.com/method/video.addAlbum?v=5.52&access_token=${process.env.vk_access_token}&group_id=${process.env.vk_video_group_id}&title=УИК №${uk.uik_id}`
                await axios.post(encodeURI(url))
                .then(async e => {
                    if(e.data.error){
                        console.log(`VK:syncAlbums error ${e.data.error.error_msg}`)
                    }else{
                        uik.update({
                            vk_album_id:e.data.response.album_id
                        },{
                            where:{
                                id:uk.id
                            }
                        })
                        console.log(`VK:syncAlbums updated ${uk.uik_id}`)
                    }
                })
                .catch(e=>console.log(e))
                this.sleep(500)//vk limits 5/s
            }
        }
        console.log(`VK:syncAlbums all albums exist`)
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
const vk = new VK()

module.exports = vk;