const Sequelize = require('sequelize')

module.exports = (sequelize) => {
    const File = sequelize.define('file', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
       url: Sequelize.STRING,
    })
    return File;
}