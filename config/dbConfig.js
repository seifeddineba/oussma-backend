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
//db.permission = require('../models/permission')(sequelize,Sequelize);
db.subscription = require('../models/subscription')(sequelize,Sequelize);
//db.subscriptionType = require('../models/subscriptionType')(sequelize,Sequelize);

// relations between tables
db.user.hasOne(db.owner);
db.owner.belongsTo(db.user);

db.user.hasOne(db.storeUser);
db.storeUser.belongsTo(db.user);



db.owner.hasMany(db.subscription);
db.subscription.belongsTo(db.owner);

// db.subscription.hasOne(db.subscriptionType);
// db.subscriptionType.belongsTo(db.subscription);
//db.subscription.belongsTo(db.admin);

db.owner.hasMany(db.store);
db.store.belongsTo(db.owner);

db.store.hasMany(db.storeUser);
db.storeUser.belongsTo(db.store);


// db.storeUser.belongsToMany(db.permission, { through: 'UserPermission' });
// db.permission.belongsToMany(db.storeUser, { through: 'UserPermission' });

module.exports = db;