const Sequelize = require('sequelize');

module.exports = (sequelize) =>{
    const User  = sequelize.define('user',{
        id : {
            type:Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        fullName: Sequelize.STRING,
        login: Sequelize.STRING,
        password: Sequelize.STRING,
    }
    , {
        timestamps: true,
        createdAt: 'created_at'
      })
    return User;
}