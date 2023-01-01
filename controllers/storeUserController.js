const db = require('../config/dbConfig');
const {validateUser} = require('../models/validator');
const bcrypt = require('bcrypt');


const User = db.user;
const Owner = db.owner;
const Store = db.store;
const StoreUser = db.storeuser;
const Role = db.role;

exports.createUser = async function(req,res){
    try {
        const {name,login,password,salary,storeId} = req.body
        // validate the request body using the schema
        const result = validateUser(req.body);
        if (result.error) {
          return res.status(400).send(result.error.details[0].message);
        }

        const existingUser = await User.findOne({ 
            where: { login: login },
            include:[{
                model:StoreUser,
                where:{
                    storeId
                }}]
            });
        if (existingUser) {
            return res.status(401).send('user login already in used');
        }

        const transaction = await db.sequelize.transaction();

        Store.findOne( {where:{
            id: storeId
        }})
        .then(async(store)=>{
            if(!store){
                return res.status(402).send("store doesn't existe");
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                name,
                login,
                password: hashedPassword
              }, { transaction });
                    // create new store
            const storeUser = await StoreUser.create({
                salary,
                userId: user.id,
                storeId: storeId
            },{ transaction });

            await transaction.commit();
    
            res.status(200).send({ message:"user created" });
        })

      } catch (error) {
        console.log(error)
        if (transaction) await transaction.rollback();{
            res.status(500).send(err);  
        }
        res.status(404).send(error);
      }
}