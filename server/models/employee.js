module.exports = (sequelize, DataTypes) => {

    const employee = sequelize.define("employee", {
        perID: {
            type: DataTypes.STRING(100),
            allowNull: false,
            primaryKey: true,
            
            references : {
                model: 'bank_user',
                key : 'perID',
            },
        },
        salary : {
            type: DataTypes.INTEGER,
            allowNULL : false,
        },
        payments : {
            type: DataTypes.INTEGER,
            allowNULL : false
        },
        earned : {
            type: DataTypes.INTEGER,
            allowNULL : false
        },
        
    }, {
        timestamps: false,
        tableName: "employee",
    });

    return employee;
}