const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());



const Sequelize = require('sequelize');
const env = require('./config/env');

const db = require('./config/dbConfig')


const sequelize = new Sequelize('myshop', env.login, env.pwd, env);


// db.sequelize.sync()
//   .then(() => {
//     console.log('Tables created or refreshed successfully');
//   })
//   .catch((error) => {
//     console.error('Error creating or refreshing tables:', error);
//   });


sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

require('./routes/router')(app);

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});