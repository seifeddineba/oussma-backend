const db = require('../config/dbConfig');
const {validateStoreUser} = require('../models/validator');
const bcrypt = require('bcrypt');
const { getUser, getUserSubscription } = require('./sharedFunctions');


const User = db.user;
const Owner = db.owner;
const Store = db.store;
const StoreUser = db.storeUser;
//const Permission = db.permission;

exports.createStoreUser = async function(req,res){
    try {
        const {fullName,login,password,salary,permissionType,storeId} = req.body
        // validate the request body using the schema
        const result = validateStoreUser(req.body);
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
            return res.status(500).send('user login already in used');
        }

        // checking the owner
        const user = await getUser(req.user.id)

        // getPermisson
        const subscription = await getUserSubscription(user.id)
        if(subscription){    
          if(new Date(subscription.endDate).getTime()*1000<Date.now()){
            return res.status(500).send('your subsicription is over');
          }
          const nbstoreUsers = StoreUser.count({ where: { ownerId :user.owner.id } });
          if(nbstoreUsers>=subscription.userAllowed){
            return res.status(500).send('you passed the limit of allowed users!');
          }
        }

        const transaction = await db.sequelize.transaction();

        Store.findOne( {where:{
            id: storeId
        }})
        .then(async(store)=>{
            if(!store){
                return res.status(500).send("store doesn't existe");
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                fullName,
                login,
                password: hashedPassword
              }, { transaction });
                    // create new store
            const storeUser = await StoreUser.create({
                permissionType,
                salary,
                userId: user.id,
                storeId
            },{ transaction });

            await transaction.commit();
    
            res.status(200).send({ message:"user created" });
        })

      } catch (error) {
        res.status(500).send({
          status:500,
          error:"server",
          message : error.message
      }); 
      }
}