function applyExtraSetup(sequelize) {
	const { user , chat } = sequelize.models;
	// user.hasMany(chat,{
	// 	onDelete: 'CASCADE',
	// 	onUpdate: 'CASCADE',
	// 	foreignKey: {
	// 		allowNull: false
	// 	},
	// })
	// chat.belongsTo(user)
}

module.exports = { applyExtraSetup };
