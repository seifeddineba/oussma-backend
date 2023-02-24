const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const OrderReference = sequelize.define('orderReferences', {
    quantity: Sequelize.INTEGER,
  },
  { timestamps: false })

  return OrderReference;
}