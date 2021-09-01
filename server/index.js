const express = require('express');
const path = require('path');
const cors = require('cors')
const sequelize = require('../sequelize');
const routes = require('./routes/');
const LocalChat = require('./utils/localChat');


const app = express();
const port = 777;

// configure middleware

async function assertDatabaseConnectionOk() {
	console.log(`Checking database connection...`);
	try {
		await sequelize.authenticate();
		let {user} = sequelize.models;
		
		//await sequelize.sync({force:true})
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
	app.use('/dist', express.static(path.resolve(__dirname, '../dist')));
	app.use(express.urlencoded({extended: false}));
	app.use(express.json()); // parse form data client
	
	app.use('/v1', routes);
	app.get('/', (req,res) => {
		res.sendFile(path.join(__dirname, '../dist/index.html'));
	});
	const server = app.listen(port, () => console.log(`Listening on port ${port}..`));
	LocalChat.init(server)
	
}

init();