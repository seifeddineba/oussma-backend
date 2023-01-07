const db = require('../config/dbConfig');
const {validateVendor } = require('../models/validator');


const User = db.user;
const Owner = db.owner;
const Store = db.store;
const StoreUser = db.storeUser;
const Subscription = db.subscription;
const Order = db.order;
const Product = db.product;
const OrderProduct = db.orderProduct;
const Vendor = db.vendor

exports.createVendor = async function (req, res) {
    try {
        const {storeId}= req.body

        const result = validateVendor(req.body);
        if (result.error) {
            return res.status(400).send(result.error.details[0].message);
        }

        const store = await Store.findByPk(storeId)
     
        if(!store){
            return res.status(500).send("store doesn't existe");
        }

        const vendor = await Vendor.create(req.body)
        
        res.status(200).send({ message:"vendor created" });
    } catch (error) {
        res.status(500).send({
            status:500,
            error:"server",
            message : error.message
        });
        
    }
}