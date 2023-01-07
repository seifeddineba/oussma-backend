const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const Category = sequelize.define('category', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    categoryName: Sequelize.STRING
  })

  return Category;
}