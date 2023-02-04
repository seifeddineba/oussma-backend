const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const Sponsor = sequelize.define('sponsor', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name : Sequelize.STRING,
    startDate: Sequelize.DATE,
    endDate: Sequelize.DATE,
    amountEuro: Sequelize.FLOAT,
    amountDinar: Sequelize.FLOAT,
    note: Sequelize.TEXT
  },
  {
    timestamps: true,
    createdAt: 'created_at',
  }
  )

  return Sponsor;
}