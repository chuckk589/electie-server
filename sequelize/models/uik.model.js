const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	sequelize.define('uik', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		address:{
			type: DataTypes.STRING,
		},
		vote_address:{
			type: DataTypes.STRING,
		},
		email:{
			type: DataTypes.STRING,
		},
		phone:{
			type: DataTypes.STRING,
		},
		watcher_phone:{
			type: DataTypes.STRING,
		},
		exp:{
			type: DataTypes.STRING
		},
		stream_url_1:{
			type: DataTypes.STRING
		},
		stream_url_2:{
			type: DataTypes.STRING
		},
		uik_id:{
			type: DataTypes.INTEGER,
			unique:true
		},
		vk_album_id:{
			type: DataTypes.INTEGER
		}
		
	},
	{ timestamps: false });
};
