const db = require('../config/dbConfig');
const {validateDeliveryCompany, isEmptyObject } = require('../models/validator');
const { Op } = require('sequelize');

const User = db.user;
const Owner = db.owner;
const Store = db.store;
const StoreUser = db.storeUser;
const Subscription = db.subscription;
const Order = db.order;
const Product = db.product;
const OrderProduct = db.orderProduct;
const Vendor = db.vendor
const DeliveryCompany = db.deliveryCompany

exports.createDeliveryCompany = async function (req, res) {
    try {
        const {storeId}= req.body

        const result = validateDeliveryCompany(req.body);
        if (result.error) {
            return res.status(400).send(result.error.details[0].message);
        }

        const store = await Store.findByPk(storeId)
     
        if(!store){
            return res.status(500).send("store doesn't existe");
        }

        const deliveryCompany = await DeliveryCompany.create(req.body)
        
        res.status(200).send({ message:"deliveryCompany created" });
    } catch (error) {
        res.status(500).send({
            status:500,
            error:"server",
            message : error.message
        });
        
    }
}

exports.getDeliveryCompanyById = async function (req,res){
    try {
        const deliveryCompany = await DeliveryCompany.findByPk(req.query.id)
        if(!deliveryCompany){
            return res.status(500).send('deliveryCompany does not exist!')
        }
        res.status(200).send(deliveryCompany);
    } catch (error) {
      res.status(500).send({
        status:500,
        error:"server",
        message : error.message
    });
    }
}

exports.updateDeliveryCompany = async function(req,res){
    try {
      const {name,email,phoneNumber,note,deliveryCompanyId}=req.body
  
      if(isEmptyObject(req.body)){
        return res.status(400).send('All fields should not be empty')
      }
  
      await DeliveryCompany.update(req.body,{where:{id:req.query.id}});
  
        res.status(200).send({ message:"DeliveryCompany Updated" });
    } catch (error) {
      res.status(500).send({
        status:500,
        error:"server",
        message : error.message
    });
    }
  }

  exports.deleteDeliveryCompany = async function(req,res){
    await DeliveryCompany.findByPk(req.query.id)
      .then(deliveryCompany => {
        if (!deliveryCompany) {
          return res.status(500).send({ message: 'deliveryCompany not found' });
        }
        return deliveryCompany.destroy()
          .then(() => res.status(200).send({ message: 'deliveryCompany deleted successfully' }));
      })
      .catch(error => res.status(400).send(error));
  };


  exports.getAllDeliveryCompanyByStoreId= async function (req,res){
    const deliveryCompanys = await DeliveryCompany.findAll({where:{storeId:req.query.id}})
    res.status(200).send(deliveryCompanys)
  }

  exports.searchDeliveryCompany = async function(req,res){
    try {
        const {name,phoneNumber,id} = req.query;
  
        let query;
        
        if ( name || phoneNumber ) {
            query = await DeliveryCompany.findAll({
                    where: {
                      name: { [Op.like]: `%${name}%` } ,
                      phoneNumber: { [Op.like]: `%${phoneNumber}%` },
                      storeId:id
                    }
                });
        } else {
            query = await DeliveryCompany.findAll();
        }
        res.status(200).send(query);
    } catch (error) {
        res.status(500).send({
            error:"server",
            message : error.message
        }); 
    }
  }