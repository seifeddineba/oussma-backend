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
    // nationality: Sequelize.STRING,
    // password: Sequelize.STRING,
    //accountType: Sequelize.STRING
  }
  );

  return Owner;
};