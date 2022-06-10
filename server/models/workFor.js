module.exports = (sequelize, DataTypes) => {

    const workFor = sequelize.define("workFor", {
            bankID: {
                type: DataTypes.STRING(100),
                allowNull: false,
                primaryKey: true,
                references: {
                    model: "bank",
                    key: "bankID"
                }
            },
            perID: {
                type: DataTypes.STRING(100),
                allowNull: false,
                primaryKey: true,
                references: {
                    model: "employee",
                    key: "perID"
                }
            }
        },
        {
            timestamps: false,
            tableName: "workFor",
        });
    return workFor;
}