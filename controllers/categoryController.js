const db = require('../config/dbConfig');
const {validateCategory, isEmptyObject } = require('../models/validator');
const { Op } = require('sequelize');

const User = db.user;
const Owner = db.owner;
const Store = db.store;
const StoreUser = db.storeUser;
const Subscription = db.subscription;
const Order = db.order;
const Product = db.product;
const OrderProduct = db.orderProduct;
const Vendor = db.vendor;
const Category = db.category

exports.createCategory = async function (req, res) {
    try {
        const {storeId}= req.body

        const result = validateCategory(req.body);
        if (result.error) {
            return res.status(400).send(result.error.details[0].message);
        }

        const store = await Store.findByPk(storeId)
     
        if(!store){
            return res.status(500).send("store doesn't existe");
        }

        const category = await Category.create(req.body)
        
        res.status(200).send({ message:"category created" });
    } catch (error) {
        res.status(500).send({
            status:500,
            error:"server",
            message : error.message
        });
        
    }
}

exports.getCategoryById = async function (req,res){
    try {
        const category = await Category.findByPk(req.query.id)
        if(!category){
            return res.status(500).send('category does not exist!')
        }
        res.status(200).send(category);
    } catch (error) {
      res.status(500).send({
        status:500,
        error:"server",
        message : error.message
    });
    }
} 


exports.updateCategory = async function(req,res){
    try {
      const {categoryName,categoryId}=req.body
  
      if(isEmptyObject(req.body)){
        return res.status(400).send('All fields should not be empty')
      }
  
      await Category.update(req.body,{where:{id:req.query.id}});
  
        res.status(200).send({ message:"Category Updated" });
    } catch (error) {
      res.status(500).send({
        status:500,
        error:"server",
        message : error.message
    });
    }
  }

  exports.deleteCategory = async function(req,res){
    await Category.findByPk(req.query.id)
      .then(category => {
        if (!category) {
          return res.status(500).send({ message: 'category not found' });
        }
        return category.destroy()
          .then(() => res.status(200).send({ message: 'category deleted successfully' }));
      })
      .catch(error => res.status(400).send(error));
  };

  exports.getAllCategoryByStoreId= async function (req,res){
    const categorys = await Category.findAll({where:{storeId:req.query.id}})
    res.status(200).send(categorys)
  }

  exports.searchCategory = async function(req,res){
    try {
        const {categoryName,id} = req.query;
  
        let query;
        
        if ( categoryName ) {
            query = await Category.findAll({
                    where: {
                      categoryName: { [Op.like]: `%${categoryName}%` } ,
                      storeId:id
                    }
                });
        } else {
            query = await Category.findAll({where:{storeId:id}});
        }
        res.status(200).send(query);
    } catch (error) {
        res.status(500).send({
            error:"server",
            message : error.message
        }); 
    }
  }