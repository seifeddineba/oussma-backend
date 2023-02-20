const db = require('../config/dbConfig');
const {validateProduct, isEmptyObject} = require('../models/validator');
const { Op } = require('sequelize');


const User = db.user;
const Owner = db.owner;
const Store = db.store;
const StoreUser = db.storeUser;
const Subscription = db.subscription;
const Order = db.order;
const Product = db.product;
const Category = db.category
const Vendor = db.vendor
const File = db.file
const Reference = db.reference
const Arrival = db.arrival;



exports.createProduct = async function (req,res){
    try {

        const {storeIds,vendorId,categoryId}=req.body

        const result = validateProduct(req.body)
        if (result.error) {
            return res.status(400).send(result.error.details[0].message);
        }


        const category = await Category.findByPk(categoryId)
        if(!category){
            return res.status(500).send("category doesn't existe");
        }

        const vendor = Vendor.findOne({ where: { id: vendorId }})
        if (!vendor) {
          return res.status(500).json({ message: 'Vendor not found' });
        }

        for (let i = 0; i < storeIds.length; i++) {
            const store = await Store.findByPk(storeIds[i]);
            if(!store) {
              return res.status(500).send("store doesn't existe");
            }
        }
        const fileName = await uploadFile(req.body.file)

        const file = await File.create({url : fileName})

        const product = await Product.create(req.body).then(async (product) => {
            await product.setStores(storeIds)

            let data = arrayProductQuantity.map((item)=>{
              return {...item,productId:product.id}
            })
            Reference.bulkCreate(data).then(async () => {
                await transaction.commit();
                res.status(200).send({ message:"order created" });
              });

        });

        await product.update({fileId:file.id})
        
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
        const product = await Product.findOne({
          where:{id:req.query.id},
          include:[
            {model: Arrival},
            {model: Reference},
            {model: File,
              as: 'attachedFile'},
            {model: Category}
        ]
        })
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
      const {name,productReference,quantityReleased,stock,
        purchaseAmount,amoutSells,file,storeIds}=req.body
  
      if(isEmptyObject(req.body)){
        return res.status(400).send('All fields should not be empty')
      }

      const product = await Product.findByPk(req.query.id)
  
      await product.update(req.body);

      const currentStores = await product.getStores()

      const storesToRemove = currentStores.filter(
      (p) => !storeIds.map((c) => c).includes(p.id)
      );
      const storesToAdd = storeIds.filter(
      (c) => !currentStores.map((p) => p.id).includes(c)
      );

      await Promise.all(
      storesToRemove.map(async (c) => await product.removeStores(c))
      );
      await Promise.all(storesToAdd.map(async (c) => await product.addStores(c)));
  
      await product.update(req.body,{where:{id:req.query.id}});
  
      res.status(200).send({ message:"product Updated" });
    } catch (error) {
      res.status(500).send({
        status:500,
        error:"server",
        message : error.message
    });
    }
  }

  exports.deleteProduct = async function(req,res){
    try{
    await Product.findByPk(req.query.id)
      .then(product => {
        if (!product) {
          return res.status(500).send({ message: 'product not found' });
        }
        return product.destroy()
          .then(() => res.status(200).send({ message: 'product deleted successfully' }));
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

  exports.getAllProductByStoreId= async function (req,res){
    try{
    const products = await Store.findByPk(req.query.id, { include: 'products' });
    res.status(200).send(products)
  } catch (error) {
    res.status(500).send({
      status:500,
      error:"server",
      message : error.message
  });
  }
  }

  
  exports.searchProduct = async function(req,res){
    try {
        const {productReference,id} = req.query;
  
        let query;
        
        if ( productReference ) {
            query = await Store.findOne({  
              where:{
                id
              },
              include: [{
              model: Product,
                where: {
                  productReference: { [Op.like]: `%${productReference}%` } ,
                }
                }]
              }
            );
        } else {
            query = await Store.findByPk(id, { include: 'products' });
        }

        if(!query)
        query=[]
        else{
          query=query.products
        }

        res.status(200).send(query);
    } catch (error) {
        res.status(500).send({
            error:"server",
            message : error.message
        }); 
    }
  }