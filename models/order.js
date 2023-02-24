const Sequelize = require('sequelize')

module.exports = (sequelize) => {
    const Order = sequelize.define('order', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        clientName: Sequelize.STRING,
        phoneNumber: Sequelize.STRING,
        address: Sequelize.STRING,
        city: Sequelize.STRING,
        region: Sequelize.STRING,
        deliveryPrice: Sequelize.FLOAT,
        sellPrice: Sequelize.FLOAT,
        totalAmount: Sequelize.FLOAT,
        gain: Sequelize.FLOAT,
        orderStatus:  {
            type: Sequelize.ENUM,
            values: ['', 'ANNULÉ', 'CONFIRMÉ','EMBALLÉ',
            'PRÊT','EN COURS','RETOUR','RETOUR REÇU',
            'RETOUR PAYÉ','LIVRÉ','PAYÉ','CONFIRMÉ/ARTICLE NON DISPONIBLE', 'PAS DE RÉPONSE']
        },
        reduction: Sequelize.FLOAT,
        exchange: Sequelize.BOOLEAN,
        exchangeReceipt: Sequelize.BOOLEAN,
        note: Sequelize.TEXT,
        collectionDate: Sequelize.DATE
        }, {
            timestamps: true,
            createdAt: 'created_at',
          })
    return Order;
}