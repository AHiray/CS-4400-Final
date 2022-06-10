module.exports = (sequelize, DataTypes) => {

    const person = sequelize.define("person", {
        perID: {
            type: DataTypes.STRING(100),
            allowNull: false,
            primaryKey: true,
        },
        pwd: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
    }, {
        timestamps: false,
        tableName: "person",
    });

    return person;
}