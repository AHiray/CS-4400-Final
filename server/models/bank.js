module.exports = (sequelize, DataTypes) => {

    const bank = sequelize.define("bank", {
        bankID: {
            type: DataTypes.STRING(100),
            allowNull: false,
            primaryKey: true,
        },
        bankName: {
            type: DataTypes.STRING(100),
        },
        street: {
            type: DataTypes.STRING(100),
            unique: "address",
        },
        city: {
            type: DataTypes.STRING(100),
            unique: "address",
        },
        state: {
            type: DataTypes.STRING(2),
            unique: "address",
        },
        zip: {
            type: DataTypes.STRING(5),
            unique: "address",
        },
        resAssets: {
            type: DataTypes.INTEGER,
        },
        corpID: {
            type: DataTypes.STRING(100),
            allowNull: false,
            references: {
                model: "corporation",
                key: "corpID",
            }
        },
        manager: {
            type: DataTypes.STRING(100),
            allowNull: false,
            uniqueKey: true,
            references: {
                model: "employee",
                key: "perID",
            }
        },
    },
        {
            timestamps: false,
            tableName: "bank",
        });
    return bank;
}