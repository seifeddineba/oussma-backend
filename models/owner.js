const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const Owner = sequelize.define('owner', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    // name: Sequelize.STRING,
    email: Sequelize.STRING,
    phoneNumber: Sequelize.STRING,
    //login: Sequelize.STRING,
    // password: Sequelize.STRING,
    accountType: Sequelize.STRING
  }
  ,{
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return Owner;
};