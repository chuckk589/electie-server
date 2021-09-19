const express = require('express');
const path = require('path');
const cors = require('cors')
const sequelize = require('../sequelize');
const fileUpload = require('express-fileupload');
const routes = require('./routes/');
const WebSocketClient = require('websocket').client;

const LocalChat = require('./utils/localChat');
const parser = require('./utils/uikParser')
const vk = require('./utils/vk')
const zadarma = require('./utils/zadarma')

const app = express();
const port = 778;
// configure middleware
async function assertDatabaseConnectionOk() {
	console.log(`Checking database connection...`);
	try {
		await sequelize.authenticate();
		// setTimeout(() => {
		// 	zadarma.getWidgetCreds()
		// }, 2000);
		//vk.syncAlbums()
		//let {user} = sequelize.models;
		
		// parser().then(e=>{
		// 	console.log(e)
		// }).catch(e=>{
		// 	console.log(e)
		// })
		//user.sync()
		//await sequelize.sync({force:true})
		// const client = new WebSocketClient()

		// client.on('connectFailed', function(error) {
		// 	console.log('Connect Error: ' + error.toString());
		// });
		
		// client.on('connect', function(connection) {
		// 	console.log('WebSocket Client Connected');
		// 	connection.on('error', function(error) {
		// 		console.log("Connection Error: " + error.toString());
		// 	});
		// 	connection.on('close', function() {
		// 		console.log('echo-protocol Connection Closed');
		// 	});
		// 	connection.on('message', function(message) {
		// 		//console.log(message);
		// 	});
			
		// });
		// client.connect('wss://spb-cache-2-4.cdn.nashvybor2021.ru/stream/12210000-0110-58aa-aaaa-ccc261942b32-main/live.mp4?mp4-fragment-length=0.5&mp4-use-speed=0&mp4-afiller=1&token=eyJhbGciOiJIUzI1NiIsImtpZCI6InNob3J0LXRva2VuLTEiLCJ0eXAiOiJKV1QifQ.eyJjaGFubmVsIjoiMTIyMTAwMDAtMDExMC01OGFhLWFhYWEtY2NjMjYxOTQyYjMyLW1haW4iLCJleHAiOjE2MzE3OTI5NTZ9.Bobj2ooTOVxlhEL-SEdD28jbD1C84eUn82vME_44GLI');
// 		fetch("https://sp.nashvybor2021.ru/tokenizer/tokens", {
//   "headers": {
//     "accept": "application/json, text/plain, */*",
//     "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
//     "authorization": "la769VakljMf2LdWl3qoJrbawtMqbKNDn3F9N6tOskd4WGJjgbtymwpuN38kTuAk8ann07/IHIivrR+LC7+IzMDhmAAb1+G1jWka",
//     "cache-control": "no-cache",
//     "content-type": "application/json",
//     "pragma": "no-cache",
//     "sec-ch-ua": "\"Google Chrome\";v=\"93\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"93\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"Windows\"",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin"
//   },
//   "referrer": "https://sp.nashvybor2021.ru/voting-stations/68996",
//   "referrerPolicy": "same-origin",
//   "body": "{\"channel_id\":\"12210000-0110-58aa-aaaa-ccc261942b32-main\"}",
//   "method": "POST",
//   "mode": "cors",
//   "credentials": "include"
// });
//{"data":"eyJhbGciOiJIUzI1NiIsImtpZCI6InNob3J0LXRva2VuLTEiLCJ0eXAiOiJKV1QifQ.eyJjaGFubmVsIjoiMTIyMTAwMDAtMDExMC01OGFhLWFhYWEtY2NjMjYxOTQyYjMyLW1haW4iLCJleHAiOjE2MzE3OTI0MzR9.U8PBTXJgzGZXTJ-NUw0k3LTsoqy59rO566HU43dWqM8"}
//wss://spb-cache-2-4.cdn.nashvybor2021.ru/stream/12210000-0110-58aa-aaaa-ccc261942b32-main/live.mp4?mp4-fragment-length=0.5&mp4-use-speed=0&mp4-afiller=1&token=eyJhbGciOiJIUzI1NiIsImtpZCI6InNob3J0LXRva2VuLTEiLCJ0eXAiOiJKV1QifQ.eyJjaGFubmVsIjoiMTIyMTAwMDAtMDExMC01OGFhLWFhYWEtY2NjMjYxOTQyYjMyLW1haW4iLCJleHAiOjE2MzE3OTI5NTZ9.Bobj2ooTOVxlhEL-SEdD28jbD
		
		console.log('Database connection OK!');
	} catch (error) {
		console.log('Unable to connect to the database:');
		console.log(error.message);
		process.exit(1);
	}
}


async function init() {
	await assertDatabaseConnectionOk();
	app.set('port', process.env.port || port); // set express to use this port
	app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
	app.set('view engine', 'ejs'); // configure template engine
	app.use(express.static(path.join(__dirname, 'views')))
	// app.use('/resources',express.static( path.resolve( __dirname, '../text' )));

	app.use(cors())
	app.use(fileUpload());
	app.use('/dist', express.static(path.resolve(__dirname, '../dist')));
	app.use(express.urlencoded({extended: false}));
	app.use(express.json()); // parse form data client

	// app.use(require('express-session')({ cookie: { maxAge: 60*60*24*1000 }, secret: 'keyboard cat', resave: false, saveUninitialized: false }));
	// app.use(passport.initialize());
	// app.use(passport.authenticate('session'));
	app.use('/v1', routes);
	app.get('/', (req,res) => {
		res.sendFile(path.join(__dirname, '../dist/index.html'));
	});
	const server = app.listen(port, () => console.log(`Listening on port ${port}..`));
	LocalChat.init(server)
}

init();
// document.querySelectorAll('.table.margtab tr').forEach(a=>{
// 	let sql ='INSERT INTO `uik_members` (`credential`, `status`, `proposedBy`, `uikId`) VALUES '
// 	let str='('
// 	a.querySelectorAll('td').forEach((b,i)=>{
// 		if(i){
// 	str+=`'${b.textContent}'`
// 	if(i!==3){
// 	str+=','
// 	}else{
// 	str+=',3);'
// 		}
// 		}
// 	})
// 	console.log(sql+str)
// 	})