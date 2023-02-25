const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const Charge = sequelize.define('charge', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    chargeType: {
      type: Sequelize.ENUM,
      values: ['PAYMENT', 'CHARGE','ACHAT']
    },
    type: {
        type: Sequelize.ENUM,
        values: ['REÇU', 'EFFECTUÉ']
    },
    amount: Sequelize.FLOAT,
    note: Sequelize.TEXT,
    date: Sequelize.DATE,
  }, {
    timestamps: true,
    createdAt: 'created_at',
  })

  return Charge;
}