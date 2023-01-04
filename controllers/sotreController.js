const { owner } = require('../config/dbConfig');
const db = require('../config/dbConfig');
const {validateStore} = require('../models/validator');
const { getUser } = require('./sharedFunctions');


const User = db.user;
const Owner = db.owner;
const Store = db.store;
const StoreUser = db.storeUser;
//const Permission = db.permission;

exports.createStore = async function(req,res){
    try {
        const {storeName,amount,payed,logo,taxCode} = req.body
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
        const subscription = await getOwnerSubscription(user.owner.id)
        if(subscription){    
          if(new Date(subscription.endDate).getTime()*1000<Date.now()){
            return res.status(500).send('store name already in used');
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
              amount,
              payed,
              logo,
              taxCode,
              ownerId: owner.id,
            });
            res.status(200).send({ message:"store created" });
         
      } catch (error) {
        res.status(500).send(error);
      }
}