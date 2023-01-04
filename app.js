const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());



const Sequelize = require('sequelize');
const env = require('./config/env');
const cookieParser = require("cookie-parser");
const db = require('./config/dbConfig')
app.use(cookieParser());
const swaggerUi = require('swagger-ui-express');
const sequelize = new Sequelize('myshop', env.login, env.pwd, env);
const swaggerFile = require('./swagger_output.json')

// db.sequelize.sync()
//   .then(() => {
//     console.log('Tables created or refreshed successfully');
//   })
//   .catch((error) => {
//     console.error('Error creating or refreshing tables:', error);
//   });

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

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