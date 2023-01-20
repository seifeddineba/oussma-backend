const Sequelize = require('sequelize');

module.exports = (sequelize) =>{
    const Store = sequelize.define('store',{
        id : {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        storeName: Sequelize.STRING,
        email: Sequelize.STRING,
        phoneNumber: Sequelize.STRING,
        url: Sequelize.STRING,
        amount: Sequelize.FLOAT,
        payed: Sequelize.FLOAT,
        logo: Sequelize.STRING,
        taxCode: Sequelize.STRING,
    } , {
        timestamps: true,
        createdAt: 'created_at'
      })

    return Store;
}