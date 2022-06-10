module.exports = (sequelize, DataTypes) => {
    
    const corporation = sequelize.define("corporation", {
        corpID: {
            type: DataTypes.STRING(100),
            allowNull: false,
            primaryKey: true,
        },
        shortName: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        longName: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        resAssets: {
            type: DataTypes.INTEGER,
            allowNULL: true
        },
    }, {
        timestamps: false,
        tableName: "corporation",
    });

    return corporation;
}