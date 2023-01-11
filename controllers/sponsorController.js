const db = require('../config/dbConfig');
const {validateSponsor, isEmptyObject } = require('../models/validator');


const User = db.user;
const Owner = db.owner;
const Store = db.store;
const StoreUser = db.storeUser;
const Subscription = db.subscription;
const Order = db.order;
const Product = db.product;
const OrderProduct = db.orderProduct;
const Vendor = db.vendor
const Sponsor = db.sponsor

exports.createSponsor = async function (req, res) {
    try {
        const {storeId}= req.body

        const result = validateSponsor(req.body);
        if (result.error) {
            return res.status(400).send(result.error.details[0].message);
        }

        const store = await Store.findByPk(storeId)
     
        if(!store){
            return res.status(500).send("store doesn't existe");
        }

        const sponsor = await Sponsor.create(req.body)
        
        res.status(200).send({ message:"sponsor created" });
    } catch (error) {
        res.status(500).send({
            status:500,
            error:"server",
            message : error.message
        });
        
    }
}

exports.getSponsorById = async function (req,res){
    try {
        const sponsor = await Sponsor.findByPk(req.query.id)
        if(!sponsor){
            return res.status(500).send('sponsor does not exist!')
        }
        res.status(200).send(sponsor);
    } catch (error) {
      res.status(500).send({
        status:500,
        error:"server",
        message : error.message
    });
    }
} 


exports.updateSponsor = async function(req,res){
    try {
      const {startDate,endDate,amountEuro,amountDinar,note,sponsorId}=req.body
  
      if(isEmptyObject(req.body)){
        return res.status(400).send('All fields should not be empty')
      }

      await Sponsor.update(req.body,{where:{id:req.query.id}});

        res.status(200).send({ message:"Sponsor Updated" });
    } catch (error) {
      res.status(500).send({
        status:500,
        error:"server",
        message : error.message
    });
    }
  }

  exports.deleteSponsor = async function(req,res){
    Sponsor.findByPk(req.query.id)
      .then(sponsor => {
        if (!sponsor) {
          return res.status(500).send({ message: 'sponsor not found' });
        }
        return sponsor.remove()
          .then(() => res.send({ message: 'sponsor deleted successfully' }));
      })
      .catch(error => res.status(400).send(error));
  };