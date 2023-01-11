const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const Vendor = sequelize.define('vendor', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: Sequelize.STRING,
    email : Sequelize.STRING,
    phoneNumber: Sequelize.STRING,
    note: Sequelize.TEXT
  })

  return Vendor;
}