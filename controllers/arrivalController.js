const db = require('../config/dbConfig');
const { validateArrival } = require('../models/validator');

const User = db.user;
const Owner = db.owner;
const Store = db.store;
const StoreUser = db.storeUser;
const Subscription = db.subscription;
const Product = db.product;
const Arrival = db.arrival;
const Vendor = db.vendor;

exports.createArrival = async function (req,res){
    try {
       const {productId,vendorId}= req.body

       const result = validateArrival(req.body);
       if (result.error) {
           return res.status(400).send(result.error.details[0].message);
       }

       const product = await Product.findByPk(productId)
       if(!product){
            return res.status(500).send("product doesn't existe");
       }

       const vendor = await Vendor.findByPk(vendorId)
       if(!vendor){
        return res.status(500).send("vendor doesn't existe");
   }

       const arrival = await Arrival.create(req.body)
        
       res.status(200).send({ message:"arrival created" });
    } catch (error) {
        res.status(500).send({
            status:500,
            error:"server",
            message : error.message
        }); 
    }
}