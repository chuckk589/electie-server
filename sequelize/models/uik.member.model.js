const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	sequelize.define('uik_member', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		credential:{
			type: DataTypes.STRING,
		},
		status:{
			type: DataTypes.STRING,
		},
		proposedBy:{
			type: DataTypes.STRING,
		},
	},
	{ timestamps: false });
};
