function applyExtraSetup(sequelize) {
	const { user , chat ,uik,uik_member} = sequelize.models;
	uik.hasOne(chat,{
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
		foreignKey: {
			allowNull: false
		},
	})
	chat.belongsTo(uik)
	uik.hasMany(uik_member,{
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
		foreignKey: {
			allowNull: false
		},
	})
	uik_member.belongsTo(uik)
}

module.exports = { applyExtraSetup };
