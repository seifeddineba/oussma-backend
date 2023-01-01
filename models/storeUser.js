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
        // password: Sequelize.STRING,
        salary: Sequelize.FLOAT,
    }
    , {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      })
    return storeUser;
}