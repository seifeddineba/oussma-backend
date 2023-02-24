const Sequelize = require('sequelize')
const env = require('./env')

const sequelize = new Sequelize('myshop', env.login, env.pwd, env);


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


// declaration modeles
db.user = require('../models/user')(sequelize,Sequelize);
db.owner = require('../models/owner')(sequelize,Sequelize);
db.store = require('../models/store')(sequelize,Sequelize);
db.storeUser = require('../models/storeUser')(sequelize,Sequelize);
db.subscription = require('../models/subscription')(sequelize,Sequelize);
db.order = require('../models/order')(sequelize,Sequelize);
db.product = require('../models/product')(sequelize,Sequelize);
db.orderReference = require('../models/order_Reference')(sequelize,Sequelize);
db.arrival = require('../models/arrival')(sequelize,Sequelize);
db.vendor = require('../models/vendor')(sequelize,Sequelize);
db.category = require('../models/category')(sequelize,Sequelize);
db.deliveryCompany = require('../models/deliveryCompany')(sequelize,Sequelize);
db.charge = require('../models/charge')(sequelize,Sequelize);
db.sponsor = require('../models/sponsor')(sequelize,Sequelize);
db.reference = require('../models/reference')(sequelize,Sequelize);
db.file = require('../models/file')(sequelize,Sequelize);


// relations between tables

// user has one owner
db.user.hasOne(db.owner);
db.owner.belongsTo(db.user);

// user has one storeUser
db.user.hasOne(db.storeUser);
db.storeUser.belongsTo(db.user);

// user has many subscription
db.user.hasMany(db.subscription);
db.subscription.belongsTo(db.user);

// owner has many store
db.owner.hasMany(db.store);
db.store.belongsTo(db.owner);

// store has many storeUser
db.store.hasMany(db.storeUser);
db.storeUser.belongsTo(db.store);

// store has many order
db.store.hasMany(db.order)
db.order.belongsTo(db.store)

// order has many product and product could be in may order
db.order.belongsToMany(db.reference, { through: 'orderReferences' });
db.reference.belongsToMany(db.order, { through: 'orderReferences' });

// store has many product and the product could be in many stores
db.store.belongsToMany(db.product, { through: 'storeProducts' });
db.product.belongsToMany(db.store, { through: 'storeProducts' });

// product has many arrival
db.product.hasMany(db.arrival);
db.arrival.belongsTo(db.product);

//product has many reference and the reference belongs to one product 
db.product.hasMany(db.reference);
db.reference.belongsTo(db.product);

//product has one file
db.product.belongsTo(db.file, { foreignKey: 'fileId', as: 'attachedFile' });


// store hasmany vendor
db.store.belongsToMany(db.vendor,{through:"storeVendors"});
db.vendor.belongsToMany(db.store,{through:"storeVendors"});

// arrival has one vendor
db.vendor.hasMany(db.arrival);
db.arrival.belongsTo(db.vendor);

// arrival has an file of facture
db.file.hasMany(db.arrival)
db.arrival.belongsTo(db.file)

//vendor has many facture files
db.vendor.hasMany(db.file);
db.file.belongsTo(db.vendor);

// category hasMany product
db.category.hasMany(db.product);
db.product.belongsTo(db.category);

// store hasmany category
db.store.belongsToMany(db.category,{through:"storeCategorys"});
db.category.belongsToMany(db.store,{through:"storeCategorys"});

//deliverycompany hasmany order
db.deliveryCompany.hasMany(db.order);
db.order.belongsTo(db.deliveryCompany);

//deliveryCompany hasmany order
db.deliveryCompany.hasMany(db.order);
db.order.belongsTo(db.deliveryCompany);

//store hasmany deliveryCompany
db.store.belongsToMany(db.deliveryCompany,{ through: 'storeDeliveryCompanys' });
db.deliveryCompany.belongsToMany(db.store,{ through: 'storeDeliveryCompanys' });

//store hasmany charge
db.store.hasMany(db.charge);
db.charge.belongsTo(db.store);

//store hasmany sponsor
db.store.hasMany(db.sponsor);
db.sponsor.belongsTo(db.store);

//sponsor hasmany order / order could have 
db.sponsor.hasMany(db.order);
db.order.belongsTo(db.sponsor);

// product has one vendor and the vendor could be in multiple prodouct
db.vendor.hasMany(db.product);



module.exports = db;