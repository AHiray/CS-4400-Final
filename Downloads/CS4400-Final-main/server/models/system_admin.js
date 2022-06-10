module.exports = (sequelize, DataTypes) => {

    const system_admin = sequelize.define("system_admin", {
            perID: {
                type: DataTypes.STRING(100),
                allowNull: false,
                primaryKey: true,
                references: {
                    model: "person",
                    key: "perID"
                }
            }
        },
        {
            timestamps: false,
            tableName: "system_admin",
        });
    return system_admin;
}