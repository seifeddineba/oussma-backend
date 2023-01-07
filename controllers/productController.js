const db = require('../config/dbConfig');
const {validateProduct} = require('../models/validator');



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
