const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	sequelize.define('user', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		credentials:{
			type: DataTypes.STRING
		},
		username: {
			type: DataTypes.STRING,
			defaultValue:'John Doe'
		},
		role:{
			type: DataTypes.INTEGER,
			defaultValue: 0
		},
		watchType:{
			type: DataTypes.ENUM,
			values: ['live', 'web','none'],
			defaultValue: 'web'
		},
		chat_id:{
			type: DataTypes.INTEGER,
			unique: true
		}
	});
};
