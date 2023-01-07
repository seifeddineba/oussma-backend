const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const Charge = sequelize.define('charge', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    type: {
        type: Sequelize.ENUM,
        values: ['RECEIVED', 'EFFECTED']
    },
    amount: Sequelize.FLOAT,
    note: Sequelize.STRING
  }, {
    timestamps: true,
    createdAt: 'created_at',
  })

  return Charge;
}