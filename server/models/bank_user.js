module.exports = (sequelize, DataTypes) => {

    const bank_user = sequelize.define("bank_user", {
            perID: {
                type: DataTypes.STRING(100),
                allowNull: false,
                primaryKey: true,
                references: {
                    model: "person",
                    key: "perID"
                }
            },
            taxID: {
                type: DataTypes.STRING(11),
                allowNull: false,
                unique : true
            },
            birthDate: {
                type: DataTypes.DATE
            },
            firstName: {
                type: DataTypes.STRING(100)
            },
            lastName: {
                type: DataTypes.STRING(100)
            },
            dtJoined: {
                type: DataTypes.DATE
            },
            street: {
                type: DataTypes.STRING(100)
            },
            city: {
                type: DataTypes.STRING(100)
            },
            state: {
                type: DataTypes.STRING(2)
            },
            zip: {
                type: DataTypes.STRING(5)
            }
        },
        {
            timestamps: false,
            tableName: "bank_user",
        });
    return bank_user;
}