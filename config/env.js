const mysql2 = require('mysql2');

const env = {
    login:'root',
    pwd:'',
    host: 'localhost',
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectModule: mysql2
}
  
module.exports = env;