const db = require('../config/dbConfig');
const { validateCharge, isEmptyObject } = require('../models/validator');

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

exports.getChargeById = async function (req,res){
    try {
        const charge = await Charge.findByPk(req.query.id)
        if(!charge){
            return res.status(500).send('charge does not exist!')
        }
        res.status(200).send(charge);
    } catch (error) {
      res.status(500).send({
        status:500,
        error:"server",
        message : error.message
    });
    }
} 

exports.updateCharge = async function(req,res){
    try {
      const {type,amount,note,chargeId}=req.body
  
      if(isEmptyObject(req.body)){
        return res.status(400).send('All fields should not be empty')
      }
  
      await Charge.update(req.body,{where:{id:req.query.id}});
  
        res.status(200).send({ message:"Charge Updated" });
    } catch (error) {
      res.status(500).send({
        status:500,
        error:"server",
        message : error.message
    });
    }
  }

  exports.deleteCharge = async function(req,res){
    await Charge.findByPk(req.query.id)
      .then(charge => {
        if (!charge) {
          return res.status(500).send({ message: 'charge not found' });
        }
        return charge.destroy()
          .then(() => res.status(200).send({ message: 'charge deleted successfully' }));
      })
      .catch(error => res.status(400).send(error));
  };

  exports.getAllChargeByStoreId= async function (req,res){
    const charges = await Charge.findAll({where:{storeId:req.query.id}})
    res.status(200).send(charges)
  }