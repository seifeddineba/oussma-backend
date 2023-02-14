const db = require('../config/dbConfig');
const {validateVendor, isEmptyObject } = require('../models/validator');
const { Op } = require('sequelize');
const { uploadFile } = require('./sharedFunctions');

const User = db.user;
const Owner = db.owner;
const Store = db.store;
const StoreUser = db.storeUser;
const Subscription = db.subscription;
const Order = db.order;
const Product = db.product;
const OrderProduct = db.orderProduct;
const Vendor = db.vendor
const File = db.file

exports.createVendor = async function (req, res) {
    try {
        const {storeIds,files}= req.body

        const result = validateVendor(req.body);
        if (result.error) {
            return res.status(400).send(result.error.details[0].message);
        }

        for (let i = 0; i < storeIds.length; i++) {
            const store = await Store.findByPk(storeIds[i]);
            if(!store) {
              return res.status(500).send("store doesn't existe");
            }
        }

        const fileName = await uploadFile(req.body.file)

        const vendor = await Vendor.create(req.body).then(async (vendor) => {
            vendor.setStores(storeIds)
            vendor.createFile(fileName)
          });
        
        res.status(200).send({ message:"vendor created" });
    } catch (error) {
        res.status(500).send({
            status:500,
            error:"server",
            message : error.message
        });
        
    }
}

exports.getVendorById = async function (req,res){
    try {
        const vendor = await Vendor.findByPk(req.query.id)
        if(!vendor){
            return res.status(500).send('vendor does not exist!')
        }
        res.status(200).send(vendor);
    } catch (error) {
      res.status(500).send({
        status:500,
        error:"server",
        message : error.message
    });
    }
} 

exports.updateVendor = async function(req,res){
    try {
      const {name,email,phoneNumber,note,storeIds}=req.body
  
      if(isEmptyObject(req.body)){
        return res.status(400).send('All fields should not be empty')
      }

      //await Vendor.update(req.body,{where:{id:req.query.id}});

      const vendor = await Vendor.findByPk(req.query.id)
  
      await vendor.update(req.body);

      const currentStores = await vendor.getStores()

      const storesToRemove = currentStores.filter(
      (p) => !storeIds.map((c) => c).includes(p.id)
      );
      const storesToAdd = storeIds.filter(
      (c) => !currentStores.map((p) => p.id).includes(c)
      );

      await Promise.all(
      storesToRemove.map(async (c) => await vendor.removeStores(c))
      );
      await Promise.all(storesToAdd.map(async (c) => await vendor.addStores(c)));

      res.status(200).send({ message:"Vendor Updated" });
    } catch (error) {
      res.status(500).send({
        status:500,
        error:"server",
        message : error.message
    });
    }
  }


  exports.deleteVendor = async function(req,res){
    try{
    await Vendor.findByPk(req.query.id)
      .then(vendor => {
        if (!vendor) {
          return res.status(500).send({ message: 'vendor not found' });
        }
        return vendor.destroy()
          .then(() => res.status(200).send({ message: 'vendor deleted successfully' }));
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


  exports.getAllVendorByStoreId= async function (req,res){
    try{
      const vendors = await Store.findByPk(req.query.id, { include: 'vendors' });
      res.status(200).send(vendors)
    } catch (error) {
      res.status(500).send({
        status:500,
        error:"server",
        message : error.message
    });
    }
  }


  exports.searchVendor = async function(req,res){
    try {
        const {name,phoneNumber,id} = req.query;
  
        let query;
        
        if ( name || phoneNumber ) {

          query = await Store.findOne({  
            where:{
              id
            },
            include: [{
            model: Vendor,
              where: {
                name: { [Op.like]: `%${name}%` } ,
                phoneNumber: { [Op.like]: `%${phoneNumber}%` }
              }
              }]
            }
          );
        } else {
            query = await Store.findByPk(id, { include: 'vendors' });
        }

        if(!query)
        query=[]
        else{
          query=query.vendors
        }

        res.status(200).send(query);
    } catch (error) {
        res.status(500).send({
            error:"server",
            message : error.message
        }); 
    }
  }
