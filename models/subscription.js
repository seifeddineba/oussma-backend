const Sequelize = require('sequelize');

module.exports = (sequelize) =>{
    const subscription  = sequelize.define('subscription',{
        id : {
            type:Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        description: Sequelize.STRING,
        period: Sequelize.INTEGER,
        endDate: Sequelize.DATE,
        price: Sequelize.FLOAT,
        storeAllowed: Sequelize.INTEGER,
        userAllowed: Sequelize.INTEGER
       }, {
        timestamps: true,
        createdAt: 'paymentDate'
      })
    return subscription;
}
