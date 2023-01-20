const db = require('../config/dbConfig');
const {validateStoreUser, isEmptyObject} = require('../models/validator');
const bcrypt = require('bcrypt');
const { getUser, getUserSubscription } = require('./sharedFunctions');
const { user } = require('../config/dbConfig');


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

exports.getStoreUserById = async function (req,res){
  try {
      const storeUser = await StoreUser.findByPk(req.query.id)
      if(!storeUser){
          return res.status(500).send('storeUser does not exist!')
      }
      res.status(200).send(storeUser);
  } catch (error) {
    res.status(500).send({
      status:500,
      error:"server",
      message : error.message
  });
  }
}  

exports.updateStoreUser = async function(req,res){
  try {
    const {fullName,login,password,salary,permissionType,userId}=req.body

    if(isEmptyObject(req.body)){
      return res.status(400).send('All fields should not be empty')
    }

    const user = await User.findOne({ where: { id: req.query.id } });

    const hashedPassword = await bcrypt.hash(password, 10);

    await user.update({fullName,login,password:hashedPassword});

    await StoreUser.update(
      {salary,permissionType}, 
      { where: {userId:user.id} });

      res.status(200).send({ message:"sotreUser Updated" });
  } catch (error) {
    res.status(500).send({
      status:500,
      error:"server",
      message : error.message
  });
  }
}

exports.deleteStoreUser = async function(req,res){
  await StoreUser.findByPk(req.query.id)
    .then(storeUser => {
      if (!storeUser) {
        return res.status(500).send({ message: 'storeUser not found' });
      }
      return storeUser.remove()
        .then(() => res.status(200).send({ message: 'storeUser deleted successfully' }));
    })
    .catch(error => res.status(400).send(error));
};


exports.getAllStoreUserByStoreId= async function (req,res){
  const storeUsers = await StoreUser.findAll({where:{storeId:req.query.id}})
  res.status(200).send(storeUsers)
}
