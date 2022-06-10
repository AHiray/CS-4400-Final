module.exports = (sequelize, DataTypes) => {

    const market = sequelize.define("market", {
            bankID: {
                type: DataTypes.STRING(100),
                allowNull: false,
                primaryKey: true,
                references: {
                    model: "interest_bearing",
                    key: "bankID"
                }
            },
            accountID: {
                type: DataTypes.STRING(100),
                allowNull: false,
                primaryKey: true,
                references: {
                    model: "interest_bearing",
                    key: "accountID"
                }
            },
            maxWithdrawals : {
                type: DataTypes.INTEGER
            },
            minWithdrawals : {
                type: DataTypes.INTEGER
            }
        },
        {
            timestamps: false,
            tableName: "market",
        });
    return market;
}