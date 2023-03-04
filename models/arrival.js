const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const Arrival = sequelize.define('arrival', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    quantity: Sequelize.INTEGER,
    buyingPrice: Sequelize.FLOAT,
    amount: Sequelize.FLOAT,
     //arrivalDate: Sequelize.DATE,
    // facture: Sequelize.STRING
  },
  {
    timestamps: true,
    createdAt: 'created_at',
  }
  )

  return Arrival;
}