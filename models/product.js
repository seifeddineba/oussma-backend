const Sequelize = require('sequelize')

module.exports = (sequelize) => {
    const Product = sequelize.define('product', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        productReference: Sequelize.STRING,
        quantityReleased: Sequelize.INTEGER,
        stock: Sequelize.INTEGER,
        purchaseAmount: Sequelize.FLOAT,
        amoutSells: Sequelize.FLOAT,
    })
    return Product;
}