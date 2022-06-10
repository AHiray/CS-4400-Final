module.exports = (sequelize, DataTypes) => {

    const interest_bearing = sequelize.define("interest_bearing", {
            bankID: {
                type: DataTypes.STRING(100),
                allowNull: false,
                primaryKey: true,
                references: {
                    model: "bank_account",
                    key: "bankID"
                }
            },
            accountID: {
                type: DataTypes.STRING(100),
                allowNull: false,
                primaryKey: true,references: {
                    model: "bank_account",
                    key: "accountID"
                }
            },
            interest_rate: {
                type: DataTypes.INTEGER,
            },
            dtDeposit: {
                type: DataTypes.DATE,
            }
        },
        {
            timestamps: false,
            tableName: "interest_bearing",
        });
    return interest_bearing;
}