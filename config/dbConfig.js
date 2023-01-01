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
db.storeuser = require('../models/storeUser')(sequelize,Sequelize);
db.role = require('../models/role')(sequelize,Sequelize);

// relations between tables
db.user.hasOne(db.owner);
db.owner.belongsTo(db.user);

db.user.hasOne(db.storeuser);
db.storeuser.belongsTo(db.user);


db.owner.hasMany(db.store);
db.store.belongsTo(db.owner);

db.store.hasMany(db.storeuser);
db.storeuser.belongsTo(db.store);

db.storeuser.belongsToMany(db.role, { through: 'UserRole' });
db.role.belongsToMany(db.storeuser, { through: 'UserRole' });

module.exports = db;