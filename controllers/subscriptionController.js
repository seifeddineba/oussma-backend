const db = require('../config/dbConfig');


const User = db.user;
const Owner = db.owner;
const Store = db.store;
const StoreUser = db.storeUser;
const Subscription = db.subscription;
const Order = db.order;
const Product = db.product;
const OrderProduct = db.orderProduct;
const Vendor = db.vendor

exports.getAllSubscription = async function(req,res){
    const subscriptions = await Subscription.findAll()
    res.status(200).send(subscriptions)
}