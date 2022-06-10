module.exports = (sequelize, DataTypes) => {

    const customer = sequelize.define("customer", {
            perID: {
                type: DataTypes.STRING(100),
                allowNull: false,
                primaryKey: true,
                references: {
                    model: "bank_user",
                    key: "perID"
                }
            }
        },
        {
            timestamps: false,
            tableName: "customer",
        });
    return customer;
}