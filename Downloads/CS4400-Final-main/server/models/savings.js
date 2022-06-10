module.exports = (sequelize, DataTypes) => {

    const savings = sequelize.define("savings", {
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
            minBalance: {
                type: DataTypes.INTEGER
            }
        },
        {
            timestamps: false,
            tableName: "savings",
        });
    return savings;
}