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
const OrderReference = db.orderReference;
const Vendor = db.vendor;
const Category = db.category

exports.createCategory = async function (req, res) {
    try {
        const {storeIds }= req.body

        const result = validateCategory(req.body);
        if (result.error) {
            return res.status(400).send(result.error.details[0].message);
        }

        for (let i = 0; i < storeIds.length; i++) {
            const store = await Store.findByPk(storeIds[i]);
            if(!store) {
              return res.status(500).send("store doesn't existe");
            }
        }

        const category = await Category.create(req.body).then(async (category) => {
            category.setStores(storeIds)
          });

          res.status(200).send({message:'category created'})
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
      const {categoryName, storeIds}=req.body
  
      if(isEmptyObject(req.body)){
        return res.status(400).send('All fields should not be empty')
      }

      const category = await Category.findByPk(req.query.id)
  
      await category.update({categoryName});

      const currentStores = await Category.getStores()

      const storesToRemove = currentStores.filter(
      (p) => !storeIds.map((c) => c).includes(p.id)
      );
      const storesToAdd = storeIds.filter(
      (c) => !currentStores.map((p) => p.id).includes(c)
      );

      await Promise.all(
      storesToRemove.map(async (c) => await category.removeStores(c))
      );
      await Promise.all(storesToAdd.map(async (c) => await category.addStores(c)));
  
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
    try{
    await Category.findByPk(req.query.id)
      .then(category => {
        if (!category) {
          return res.status(500).send({ message: 'category not found' });
        }
        return category.destroy()
          .then(() => res.status(200).send({ message: 'category deleted successfully' }));
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

  exports.getAllCategoryByStoreId= async function (req,res){
    try{
    const categorys = await Store.findByPk(req.query.id, { include: 'categories' });
    res.status(200).send(categorys)
    } catch (error) {
      res.status(500).send({
        status:500,
        error:"server",
        message : error.message
    });
    }
  }

  exports.searchCategory = async function(req,res){
    try {
        const {categoryName,id} = req.query;
        let query;
        if ( categoryName ) {
            query = await Store.findOne({  
              where:{
                id
              },
              include: [{
              model: Category,
                where: {
                  categoryName: { [Op.like]: `%${categoryName}%` }
                }
            }]
          }
            );
        } else {
            query = await Store.findByPk(id, { include: 'categories' });
        }

        if(!query)
        query=[]
        else{
          query=query.categories
        }

        res.status(200).send(query);
    } catch (error) {
        res.status(500).send({
            error:"server",
            message : error.message
        }); 
    }
  }