const Sequelize = require('sequelize');

module.exports = (sequelize) =>{
    const Role  = sequelize.define('role',{
        id : {
            type:Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: Sequelize.STRING,
        description: Sequelize.STRING
    }
    , {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      })
    return Role;
}