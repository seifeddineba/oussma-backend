const db = require('../config/dbConfig');
const {validateSponsor, isEmptyObject } = require('../models/validator');
const { Op } = require('sequelize');
const { generateFactureCode } = require('./sharedFunctions');

const User = db.user;
const Owner = db.owner;
const Store = db.store;
const StoreUser = db.storeUser;
const Subscription = db.subscription;
const Order = db.order;
const Product = db.product;
const OrderReference = db.orderReference;
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

        const code = await generateFactureCode(sponsor.id)
        sponsor.code = code
        sponsor.save()
        
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
      //const {startDate,endDate,amountEuro,amountDinar,note,sponsorId}=req.body
  
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
    await Sponsor.findByPk(req.query.id)
      .then(sponsor => {
        if (!sponsor) {
          return res.status(500).send({ message: 'sponsor not found' });
        }
        return sponsor.destroy()
          .then(() => res.status(200).send({ message: 'sponsor deleted successfully' }));
      })
      .catch(error => res.status(400).send(error));
  };

  exports.getAllSponsorByStoreId= async function (req,res){
    const sponsors = await Sponsor.findAll({where:{storeId:req.query.id}})
    res.status(200).send(sponsors)
  }

  exports.searchSponsor = async function(req,res){
    try {
        const {id} = req.query;
  
        let query;
        
        // if ( name ) {
        //     query = await Sponsor.findAll({
        //             where: {
        //               //name: { [Op.like]: `%${name}%` } ,
        //               storeId:id
        //             }
        //         });
        // } else {
            query = await Sponsor.findAll({where:{storeId:id}});
        //}
        res.status(200).send(query);
    } catch (error) {
        res.status(500).send({
            error:"server",
            message : error.message
        }); 
    }
  }