const { owner } = require('../config/dbConfig');
const db = require('../config/dbConfig');
const {validateStore, isEmptyObject} = require('../models/validator');
const { getUser, getUserSubscription } = require('./sharedFunctions');


const User = db.user;
const Owner = db.owner;
const Store = db.store;
const StoreUser = db.storeUser;
//const Permission = db.permission;

exports.createStore = async function(req,res){
    try {
        const {storeName,email,phoneNumber,url,amount,payed,logo,taxCode} = req.body
        // validate the request body using the schema
       
        const result = validateStore(req.body);
        if (result.error) {
          return res.status(400).send(result.error.details[0].message);
        }

        const existingStoreName = await Store.findOne({ where: { storeName: storeName } });
        if (existingStoreName) {
            return res.status(500).send('store name already in used');
        }

        // checking the owner
        const user = await getUser(req.user.id)

        // getPermisson
        const subscription = await getUserSubscription(user.id)
        if(subscription){    
          if(new Date(subscription.endDate).getTime()*1000<Date.now()){
            return res.status(500).send('your subsicription is over');
          }
          const nbstores = Store.count({ where: { ownerId :user.owner.id } });
          if(nbstores>=subscription.storeAllowed){
            return res.status(500).send('you passed the limit of allowed stores!');
          }
        }
       
          const {owner} = user
     
            if(!owner){
                return res.status(500).send("owner doesn't existe");
            }
            // create new store
            const store = await Store.create({
              storeName,
              email,
              phoneNumber,
              url,
              amount,
              payed,
              logo,
              taxCode,
              ownerId: owner.id,
            });
            res.status(200).send({ message:"store created" });
         
      } catch (error) {
        res.status(500).send({
          status:500,
          error:"server",
          message : error.message
      }); 
      }
}

exports.getStoreById = async function (req,res){
  try {
      const store = await Store.findByPk(req.query.id)
      if(!store){
          return res.status(500).send('store does not exist!')
      }
      res.status(200).send(store);
  } catch (error) {
    res.status(500).send({
      status:500,
      error:"server",
      message : error.message
  });
  }
}

exports.updateStore = async function(req,res){
  try {

    if(isEmptyObject(req.body)){
      return res.status(400).send('All fields should not be empty')
    }

    await Store.update(req.body,{where:{id:req.query.id}});

      res.status(200).send({ message:"Store Updated" });
  } catch (error) {
    res.status(500).send({
      status:500,
      error:"server",
      message : error.message
  });
  }
}

exports.deleteStore = async function(req,res){
  await Store.findByPk(req.query.id)
    .then(store => {
      if (!store) {
        return res.status(500).send({ message: 'store not found' });
      }
      return store.destroy()
        .then(() => res.status(200).send({ message: 'store deleted successfully' }));
    })
    .catch(error => res.status(400).send(error));
};


exports.getAllStoresByOwnerId = async function(req,res){
  const stores = await Store.findAll({where:{ownerId:req.query.id}})
  res.status(200).send(stores)
}

  
exports.searchStore = async function(req,res){
  try {
      const {storeName,phoneNumber,id} = req.query;

      let query;
      
      if ( storeName || phoneNumber ) {
          query = await Store.findAll({
                  where: {
                    storeName: { [Op.like]: `%${storeName}%` } ,
                    phoneNumber: { [Op.like]: `%${phoneNumber}%` } ,
                    ownerId:id
                  }
              });
      } else {
          query = await Store.findAll({where:{ownerId:id}});
      }
      res.status(200).send(query);
  } catch (error) {
      res.status(500).send({
          error:"server",
          message : error.message
      }); 
  }
}