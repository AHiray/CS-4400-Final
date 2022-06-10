module.exports = (sequelize, DataTypes) => {

    const bank_account = sequelize.define("bank_account", {
            bankID: {
                type: DataTypes.STRING(100),
                allowNull: false,
                primaryKey: true,
                references: {
                    model: "bank",
                    key: "bankID"
                }
            },
            accountID: {
                type: DataTypes.STRING(100),
                allowNull: false,
                primaryKey: true,
            },
            balance: {
                type: DataTypes.INTEGER,
            }
        },
        {
            timestamps: false,
            tableName: "bank_account",
        });
    return bank_account;
}