const db = require('../config/dbConfig');
const {validateDeliveryCompany, isEmptyObject } = require('../models/validator');
const { Op } = require('sequelize');
const { uploadFile } = require('./sharedFunctions');

const User = db.user;
const Owner = db.owner;
const Store = db.store;
const StoreUser = db.storeUser;
const Subscription = db.subscription;
const Order = db.order;
const Product = db.product;
const orderReference = db.orderReference;
const Vendor = db.vendor
const DeliveryCompany = db.deliveryCompany

exports.createDeliveryCompany = async function (req, res) {
    try {
        const {storeIds,logo}= req.body

        const result = validateDeliveryCompany(req.body);
        if (result.error) {
            return res.status(400).send(result.error.details[0].message);
        }

        for (let i = 0; i < storeIds.length; i++) {
            const store = await Store.findByPk(storeIds[i]);
            if(!store) {
              return res.status(500).send("store doesn't existe");
            }
        }

        let data  = req.body

        let fileName = ""
        if(logo){
            fileName = await uploadFile(logo)
            data.logo = fileName
        }
        
      
        await DeliveryCompany.create(data).then(async (deliveryCompany) => {
            deliveryCompany.setStores(storeIds)
          });

        
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
      const {name,email,phoneNumber,note,status,deliveryPrice
        ,retourPrice,logo,storeIds}=req.body
  
      if(isEmptyObject(req.body)){
        return res.status(400).send('All fields should not be empty')
      }

      const deliveryCompany = await DeliveryCompany.findByPk(req.query.id)

      let data  = req.body

      if(logo){
        const fileName =  await uploadFile(req.body.logo)
        data.logo = fileName
      }
  
      await deliveryCompany.update(data);

      const currentStores = await deliveryCompany.getStores()

      const storesToRemove = currentStores.filter(
      (p) => !storeIds.map((c) => c).includes(p.id)
      );
      const storesToAdd = storeIds.filter(
      (c) => !currentStores.map((p) => p.id).includes(c)
      );

      await Promise.all(
      storesToRemove.map(async (c) => await deliveryCompany.removeStores(c))
      );
      await Promise.all(storesToAdd.map(async (c) => await deliveryCompany.addStores(c)));
  
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
    try {

      await DeliveryCompany.findByPk(req.query.id)
      .then(deliveryCompany => {
        if (!deliveryCompany) {
          return res.status(500).send({ message: 'deliveryCompany not found' });
        }
        return deliveryCompany.destroy()
          .then(() => res.status(200).send({ message: 'deliveryCompany deleted successfully' }));
      })
      .catch(error => res.status(400).send(error));
      
    } catch (error) {
      res.status(500).send({
        status:500,
        error:"server",
        message : error.message
    });
    }

  };


  exports.getAllDeliveryCompanyByStoreId= async function (req,res){
    try{
    const deliveryCompanys = await Store.findByPk(req.query.id, { include: [{model:DeliveryCompany}] });
    res.status(200).send(deliveryCompanys)
    } catch (error) {
      res.status(500).send({
        status:500,
        error:"server",
        message : error.message
    });
    }
  }

  exports.searchDeliveryCompany = async function(req,res){
    try {
        const {name,phoneNumber,id} = req.query;
  
        let query;
        
        if ( name || phoneNumber ) {

          query = await Store.findOne({  
            where:{
              id
            },
            include: [{
            model: DeliveryCompany,
              where: {
                name: { [Op.like]: `%${name}%` } ,
                phoneNumber: { [Op.like]: `%${phoneNumber}%` }
              }
              }]
            }
          );

        } else {
            query = await Store.findOne({ where:{
              id
            },
            include: [{
              model: DeliveryCompany
                }]
            });
        }

        if(!query)
        query=[]
        else{
          query=query.deliveryCompanies
        }

        res.status(200).send(query);
    } catch (error) {

      console.log(error
        )
        res.status(500).send({
            error:"server",
            message : error.message
        }); 
    }
  }