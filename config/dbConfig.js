const Sequelize = require('sequelize')
const env = require('./env')

const sequelize = new Sequelize('myshop', env.login, env.pwd, env);


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


// declaration modeles
db.owner = require('../models/owner')(sequelize,Sequelize);
db.store = require('../models/store')(sequelize,Sequelize);
db.user = require('../models/user')(sequelize,Sequelize);
db.role = require('../models/role')(sequelize,Sequelize);

// relations between tables
db.owner.hasMany(db.store);
db.store.belongsTo(db.owner);

db.store.hasMany(db.user);
db.user.belongsTo(db.store);

db.user.belongsToMany(db.role, { through: 'UserRole' });
db.role.belongsToMany(db.user, { through: 'UserRole' });

module.exports = db;