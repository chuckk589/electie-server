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
			unique: true
		},
		role:{
			type: DataTypes.INTEGER,
			defaultValue: 0
		},
		chat_id:{
			type: DataTypes.INTEGER,
			unique: true
		}
	});
};