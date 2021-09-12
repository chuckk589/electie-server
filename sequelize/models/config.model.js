const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	sequelize.define('config', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		name:{
			type: DataTypes.STRING,
		},
		value:{
			type: DataTypes.STRING,
		},
		category:{
			type: DataTypes.STRING,
		},
		editable:{
			type: DataTypes.INTEGER,
			defaultValue: 1
		},
		requiresReset:{
			type: DataTypes.INTEGER,
			defaultValue: 0
		}
	},
	{ timestamps: false ,tableName:'config'});
};
