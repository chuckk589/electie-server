const { Sequelize } = require('sequelize');
const { applyExtraSetup } = require('./extra-setup');

const options = {
	dev:{
		host: 'localhost',
		dialect: 'mysql',
		logQueryParameters: true,
		//benchmark: true,
		logging: true,
		username:'mysql',
		password:"mysql",
		database: "electie"
	},
	prod:{
		host:'localhost',
		dialect: 'mysql',
		username:'root',
		password:"gumioqi226",
		database: "electie",
		logging: false,
		define: {
			charset: 'utf8',
			collate: 'utf8_general_ci',
		},
		dialectOptions: {
			socketPath: '/var/lib/mysql/mysql.sock'
		}
	}
}

const sequelize = new Sequelize(process.argv.includes('-prod') ? options.prod : options.dev);

const modelDefiners = [
	require('./models/user.model'),
	require('./models/chat.model'),
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}

// We execute any extra setup after the models are defined, such as adding associations.
applyExtraSetup(sequelize);



// We export the sequelize connection instance to be used around our app.
module.exports = sequelize;
