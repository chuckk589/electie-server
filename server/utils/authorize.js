const { google } = require('googleapis');
const sequelize = require('../../sequelize');
const { Op } = require("sequelize");
const {config} = sequelize.models;
const service = google.youtube('v3');

class authorize {
    constructor(){
        console.log('oauth constructor')
        config.findAll({where:{
            name:{
              [Op.or]: ['google_api_client_id','google_api_client_secret','google_api_callback_ip','google_api_refresh_token']
            }
        }}).then(conf=>{
            const secret = conf.find(e=>e.name == 'google_api_client_secret').value
            const client_id = conf.find(e=>e.name == 'google_api_client_id').value
            const host = conf.find(e=>e.name == 'google_api_callback_ip').value
            const refreshToken = conf.find(e=>e.name == 'google_api_refresh_token')?.value
            this.oauth2Client = new google.auth.OAuth2(client_id,secret,`${host}/v1/auth/oauthcb`)
            this.oauth2Client.on('tokens', (tokens) => {
                console.log('oauth tokens update event')
                if (tokens.refresh_token) {
                  //console.log(tokens.refresh_token);
                  config.update({
                      value:tokens.refresh_token
                  },{
                      where:{
                          name:'google_api_refresh_token'
                      }
                  })
                }
                //console.log(tokens.access_token);
                config.update({
                    value:tokens.access_token
                },{
                    where:{
                        name:'google_api_access_token'
                    }
                })
              });
            if(refreshToken){
                this.oauth2Client.setCredentials({
                    refresh_token: refreshToken
                });
            }
        })
    }
    getLink(){
        console.log('link requested')
        return this.oauth2Client.generateAuthUrl({
            // 'online' (default) or 'offline' (gets refresh_token)
            access_type: 'offline',
            
            // If you only need one scope you can pass it as a string
            scope: 'https://www.googleapis.com/auth/youtube.upload'
        });
    }
    async auth(code){
        console.log('oauth event')
        const {tokens} = await this.oauth2Client.getToken(code)
        this.oauth2Client.setCredentials(tokens);
    }
    insert(vid,cb){
        service.videos.insert(
            {
                auth: this.oauth2Client,
                part: 'snippet,contentDetails,status',
                resource: {
                    // Video title and description
                    snippet: {
                        title: 'My title',
                        description: 'My description'
                    },
                    // I set to private for tests
                    status: {
                        privacyStatus: 'private'
                    }
                },
                media: {
                    body: vid 
                }
            },
            (error, data) => {
                if (error) {
                    cb({status: false, error:error})
                }else{
                    cb({status: true, url:`https://www.youtube.com/watch?v=${data.data.id}`})
                }
            }
        );
    }
}
const auth = new authorize()

module.exports = auth;