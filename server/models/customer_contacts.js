module.exports = (sequelize, DataTypes) => {

    const customer_contacts = sequelize.define("customer_contacts", {
            perID: {
                type: DataTypes.STRING(100),
                allowNull: false,
                primaryKey: true,
                references: {
                    model: "customer",
                    key: "perID"
                }
            },
            contact_type: {
                type: DataTypes.STRING(100),
                primaryKey: true,
            },
            info: {
                type: DataTypes.STRING(100),
                primaryKey: true,
            }
        },
        {
            timestamps: false,
            tableName: "customer_contacts",
        });
    return customer_contacts;
}