module.exports = (sequelize, DataTypes) => {

    const access = sequelize.define("access", {
            perID: {
                type: DataTypes.STRING(100),
                allowNull: false,
                primaryKey: true,
                references: {
                    model: "customer",
                    key: "perID"
                }
            },
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
                primaryKey: true,
                references: {
                    model: "bank_account",
                    key: "accountID"
                }
            },
            dtShareStart: {
                type: DataTypes.DATE,
                allowNull: false
            },
            dtAction: {
                type: DataTypes.DATE,
            }
        },
        {
            timestamps: false,
            tableName: "access",
        });
    return access;
}