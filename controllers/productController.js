const db = require('../config/dbConfig');
const {validateProduct, isEmptyObject} = require('../models/validator');



const User = db.user;
const Owner = db.owner;
const Store = db.store;
const StoreUser = db.storeUser;
const Subscription = db.subscription;
const Order = db.order;
const Product = db.product;
const Category = db.category


exports.createProduct = async function (req,res){
    try {

        const {productReference,quantityReleased,stock,
          purchaseAmount,amoutSells,storeId,categoryId}=req.body

        const result = validateProduct(req.body)
        if (result.error) {
            return res.status(400).send(result.error.details[0].message);
        }

        const store = await Store.findByPk(storeId)
     
        if(!store){
            return res.status(500).send("store doesn't existe");
        }

        const category = await Category.findByPk(categoryId)
     
        if(!category){
            return res.status(500).send("category doesn't existe");
        }

        const product = await Product.create(req.body)
        
        res.status(200).send({ message:"product created" }); 

    } catch (error) {
        res.status(500).send({
            status:500,
            error:"server",
            message : error.message
        }); 
    }
}

exports.getProductById = async function (req,res){
    try {
        const product = await Product.findByPk(req.query.id)
        if(!product){
            return res.status(500).send('product does not exist!')
        }
        res.status(200).send(product);
    } catch (error) {
      res.status(500).send({
        status:500,
        error:"server",
        message : error.message
    });
    }
} 


exports.updateProduct = async function(req,res){
    try {
      const {productReference,quantityReleased,stock,purchaseAmount,amoutSells,productId}=req.body
  
      if(isEmptyObject(req.body)){
        return res.status(400).send('All fields should not be empty')
      }
  
      await Product.update(req.body,{where:{id:req.query.id}});
  
        res.status(200).send({ message:"Product Updated" });
    } catch (error) {
      res.status(500).send({
        status:500,
        error:"server",
        message : error.message
    });
    }
  }

  exports.deleteProduct = async function(req,res){
    await Product.findByPk(req.query.id)
      .then(product => {
        if (!product) {
          return res.status(500).send({ message: 'product not found' });
        }
        return product.destroy()
          .then(() => res.status(200).send({ message: 'product deleted successfully' }));
      })
      .catch(error => res.status(400).send(error));
  };

  exports.getAllProductByStoreId= async function (req,res){
    const products = await Product.findAll({where:{storeId:req.query.id}})
    res.status(200).send(products)
  }

  
  exports.searchProduct = async function(req,res){
    try {
        const {productReference,id} = req.query;
  
        let query;
        
        if ( productReference ) {
            query = await Product.findAll({
                    where: {
                      productReference: { [Op.like]: `%${productReference}%` } ,
                      storeId:id
                    }
                });
        } else {
            query = await Product.findAll({where:{storeId:id}});
        }
        res.status(200).send(query);
    } catch (error) {
        res.status(500).send({
            error:"server",
            message : error.message
        }); 
    }
  }