const db = require('../config/dbConfig');
const { validateCharge } = require('../models/validator');

const User = db.user;
const Owner = db.owner;
const Store = db.store;
const StoreUser = db.storeUser;
const Subscription = db.subscription;
const Product = db.product;
const Arrival = db.arrival;
const Vendor = db.vendor;
const Charge = db.charge;

exports.createCharge = async function (req,res){
    try {
       const {storeId}= req.body

       const result = validateCharge(req.body);
       if (result.error) {
           return res.status(400).send(result.error.details[0].message);
       }

       const store = await Store.findByPk(storeId)
       if(!store){
            return res.status(500).send("store doesn't existe");
       }

       const charge = await Charge.create(req.body)
        
       res.status(200).send({ message:"charge created" });
    } catch (error) {
        res.status(500).send({
            status:500,
            error:"server",
            message : error.message
        }); 
    }
}