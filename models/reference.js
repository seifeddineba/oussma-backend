const Sequelize = require('sequelize')

module.exports = (sequelize) => {
    const Reference = sequelize.define('reference', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
       refernce: Sequelize.STRING,
       quantity: Sequelize.INTEGER
    })
    return Reference;
}