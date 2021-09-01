const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	sequelize.define('chat', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		telegram_id:{
			type: DataTypes.INTEGER,
			unique: true
		},
		uik_id:{
			type: DataTypes.INTEGER,
			unique: true
		},
		inviteLink:{
			type: DataTypes.STRING
		},
		name:{
			type: DataTypes.STRING
		}
	});
};
