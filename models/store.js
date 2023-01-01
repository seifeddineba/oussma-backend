const Sequelize = require('sequelize');

module.exports = (sequelize) =>{
    const Store = sequelize.define('store',{
        id : {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: Sequelize.STRING,
        amount: Sequelize.FLOAT,
        payed: Sequelize.FLOAT,
        logo: Sequelize.STRING,
        taxCode: Sequelize.STRING,
    } , {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      })

    return Store;
}