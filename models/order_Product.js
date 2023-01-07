const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const OrderProduct = sequelize.define('orderProducts', {
    quantity: Sequelize.INTEGER,
  },
  { timestamps: false })

  return OrderProduct;
}