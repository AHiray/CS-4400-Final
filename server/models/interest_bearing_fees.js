module.exports = (sequelize, DataTypes) => {

    const interest_bearing_fees = sequelize.define("interest_bearing_fees", {
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
            fee: {
                type: DataTypes.STRING(100),
                primaryKey: true

            }
        },
        {
            timestamps: false,
            tableName: "interest_bearing_fees",
        });
    return interest_bearing_fees;
}