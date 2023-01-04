const Sequelize = require('sequelize');

module.exports = (sequelize) =>{
    const storeUser  = sequelize.define('storeUser',{
        id : {
            type:Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        // name: Sequelize.STRING,
        // login: Sequelize.STRING,
        permissionType: {
            type: Sequelize.ENUM,
            values: ['SELLER', 'CHIEF', 'RESPONSABLE']
          },
        salary: Sequelize.FLOAT,
    }
    , {
        timestamps: true,
        createdAt: 'created_at'
      })
    return storeUser;
}