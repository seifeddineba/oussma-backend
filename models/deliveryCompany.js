const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const DeliveryCompany = sequelize.define('deliveryCompany', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    phoneNumber: Sequelize.STRING,
    note: Sequelize.TEXT,
    status: {
      type:Sequelize.ENUM,
      values: ['ACTIVE', 'INACTIF']
    },
    deliveryPrice: Sequelize.FLOAT,
    retourPrice: Sequelize.FLOAT,
    logo: Sequelize.STRING
  })

  return DeliveryCompany;
}