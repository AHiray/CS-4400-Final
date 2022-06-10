module.exports = (sequelize, DataTypes) => {

    const checking = sequelize.define("checking", {
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
            protectionBank: {
                type: DataTypes.STRING(100),
                unique: "protection",
                references: {
                    model: "savings",
                    key: "bankID"
                }
            },
            protectionAccount: {
                type: DataTypes.STRING(100),
                unique: "protection",
                references: {
                    model: "savings",
                    key: "accountID"
                }
            },
            amount: {
                type: DataTypes.INTEGER
            },
            dtOverdraft: {
                type: DataTypes.DATE
            }
        },
        {
            timestamps: false,
            tableName: "checking",
        });
    return checking;
}