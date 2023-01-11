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
    note: Sequelize.TEXT
  })

  return DeliveryCompany;
}