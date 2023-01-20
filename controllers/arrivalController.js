const db = require('../config/dbConfig');
const { validateArrival, isEmptyObject } = require('../models/validator');

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

exports.getArrivalById = async function (req,res){
    try {
        const arrival = await Arrival.findByPk(req.query.id)
        if(!arrival){
            return res.status(500).send('arrival does not exist!')
        }
        res.status(200).send(arrival);
    } catch (error) {
      res.status(500).send({
        status:500,
        error:"server",
        message : error.message
    });
    }
} 

exports.updateArrival = async function(req,res){
    try {
      const {quantity,buyingPrice,amount,facture,arrivalDate}=req.body
      if(isEmptyObject(req.body)){
        return res.status(400).send('All fields should not be empty')
      }
  
      await Arrival.update(req.body,{where:{id:req.query.id}});
  
        res.status(200).send({ message:"Arrival Updated" });
    } catch (error) {
      res.status(500).send({
        status:500,
        error:"server",
        message : error.message
    });
    }
  }

exports.deleteArrival = async function(req,res){
  await Arrival.findByPk(req.query.id)
    .then(arrival => {
      if (!arrival) {
        return res.status(500).send({ message: 'arrival not found' });
      }
      return arrival.remove()
        .then(() => res.status(200).send({ message: 'arrival deleted successfully' }));
    })
    .catch(error => res.status(400).send(error));
};


exports.getAllArrivalByStoreId= async function (req,res){
  const arrivals = await Arrival.findAll({where:{storeId:req.query.id}})
  res.status(200).send(arrivals)
}