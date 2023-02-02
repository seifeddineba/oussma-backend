const db = require('../config/dbConfig');
const {validateVendor, isEmptyObject } = require('../models/validator');


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
      const {name,email,phoneNumber,note,vendorId}=req.body
  
      if(isEmptyObject(req.body)){
        return res.status(400).send('All fields should not be empty')
      }

      await Vendor.update(req.body,{where:{id:req.query.id}});

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
    await Vendor.findByPk(req.query.id)
      .then(vendor => {
        if (!vendor) {
          return res.status(500).send({ message: 'vendor not found' });
        }
        return vendor.destroy()
          .then(() => res.status(200).send({ message: 'vendor deleted successfully' }));
      })
      .catch(error => res.status(400).send(error));
  };


  exports.getAllVendorByStoreId= async function (req,res){
    const vendors = await Vendor.findAll({where:{storeId:req.query.id}})
    res.status(200).send(vendors)
  }


  exports.searchVendor = async function(req,res){
    try {
        const {name,phoneNumber,id} = req.query;
  
        let query;
        
        if ( name || phoneNumber ) {
            query = await Vendor.findAll({
                    where: {
                      name: { [Op.like]: `%${name}%` } ,
                      phoneNumber: { [Op.like]: `%${phoneNumber}%` } ,
                      storeId:id
                    }
                });
        } else {
            query = await Vendor.findAll({where:{storeId:id}});
        }
        res.status(200).send(query);
    } catch (error) {
        res.status(500).send({
            error:"server",
            message : error.message
        }); 
    }
  }
