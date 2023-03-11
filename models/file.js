const Sequelize = require('sequelize')

module.exports = (sequelize) => {
    const File = sequelize.define('file', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
       url: Sequelize.STRING,
       date: Sequelize.DATE,
       totalAmount: Sequelize.FLOAT,
       description: Sequelize.TEXT,
       code: Sequelize.STRING,
    })
    return File;
}