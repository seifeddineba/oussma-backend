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
db.orderProduct = require('../models/order_Product')(sequelize,Sequelize);
db.arrival = require('../models/arrival')(sequelize,Sequelize);
db.vendor = require('../models/vendor')(sequelize,Sequelize);
db.category = require('../models/category')(sequelize,Sequelize)
db.deliveryCompany = require('../models/deliveryCompany')(sequelize,Sequelize)
db.charge = require('../models/charge')(sequelize,Sequelize)


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
db.order.belongsToMany(db.product, { through: 'orderProducts' });
db.product.belongsToMany(db.order, { through: 'orderProducts' });

// store has many product
db.store.hasMany(db.product)
db.product.belongsTo(db.store)

// product has many arrival
db.product.hasMany(db.arrival);
db.arrival.belongsTo(db.product);

// store hasmany vendor
db.store.hasMany(db.vendor);
db.vendor.belongsTo(db.store);

// arrival has one vendor
db.vendor.hasMany(db.arrival);
db.arrival.belongsTo(db.vendor);

// category hasMany product
db.category.hasMany(db.product);
db.product.belongsTo(db.category);

// store hasmany category
db.store.hasMany(db.category);
db.category.belongsTo(db.store);

//deliverycompany hasmany order
db.deliveryCompany.hasMany(db.order);
db.order.belongsTo(db.deliveryCompany);

//deliveryCompany hasmany order
db.deliveryCompany.hasMany(db.order);
db.order.belongsTo(db.deliveryCompany);

//store hasmany deliveryCompany
db.store.hasMany(db.deliveryCompany);
db.deliveryCompany.belongsTo(db.store);

//store hasmany charge
db.store.hasMany(db.charge);
db.charge.belongsTo(db.store);



module.exports = db;