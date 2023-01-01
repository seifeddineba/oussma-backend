const { owner } = require('../config/dbConfig');
const db = require('../config/dbConfig');
const {validateStore} = require('../models/validator');


const User = db.user;
const Owner = db.owner;
const Store = db.store;
const StoreUser = db.storeuser;
const Role = db.role;

exports.createStore = async function(req,res){
    try {
        const {name,amount,payed,logo,taxCode,ownerId} = req.body
        // validate the request body using the schema
        const result = validateStore(req.body);
        if (result.error) {
          return res.status(400).send(result.error.details[0].message);
        }

        const existingStoreName = await Store.findOne({ where: { name: name } });
        if (existingStoreName) {
            return res.status(401).send('store name already in used');
        }

        // checking the owner
        await Owner.findOne({
            where: {
              id: ownerId,
            },
          }).then(async (owner) => {
            if(!owner){
                return res.status(402).send("owner doesn't existe");
            }
            // create new store
            const store = await Store.create({
                name: name,
                amount: amount,
                payed: payed,
                logo: logo,
                taxCode: taxCode,
                ownerId: ownerId,
            });
            res.status(200).send({ message:"store created" });
          })
      } catch (error) {
        res.status(404).send(error);
      }
}