const db = require('../config/dbConfig');
const {validateUser} = require('../models/validator');
const bcrypt = require('bcrypt');


const Owner = db.owner;
const Store = db.store;
const User = db.user;
const Role = db.role;

exports.createUser = async function(req,res){
    try {
        const {name,login,password,salary,storeId} = req.body
        // validate the request body using the schema
        const result = validateUser(req.body);
        if (result.error) {
          return res.status(400).send(result.error.details[0].message);
        }

        const existingUser = await User.findOne({ where: { login: login , storeId: storeId  } });
        if (existingUser) {
            return res.status(401).send('user login already in used');
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);

        Store.findOne( {where:{
            id: storeId
        }})
        .then(async(store)=>{
            if(!store){
                return res.status(402).send("store doesn't existe");
            }
                    // create new store
            const user = await User.create({
                name: name,
                login: login,
                password: hashedPassword,
                salary: salary,
                storeId: storeId
            });
    
            res.status(200).send({ message:"user created" });
        })

      } catch (error) {
        res.status(404).send(error);
      }
}