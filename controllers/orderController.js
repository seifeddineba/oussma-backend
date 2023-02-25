const db = require('../config/dbConfig');
const { validateOrder, isEmptyObject } = require('../models/validator');
const { Op } = require('sequelize');

const User = db.user;
const Owner = db.owner;
const Store = db.store;
const StoreUser = db.storeUser;
const Subscription = db.subscription;
const Order = db.order;
const Product = db.product;
const OrderReference = db.orderReference
const Reference = db.reference
const DeliveryCompany = db.deliveryCompany
const Sponsor = db.sponsor

exports.createOrder = async function (req, res) {
    try {
        const {clientName,phoneNumber,address,city,region,deliveryPrice,sellPrice,
            totalAmount,orderStatus,note,collectionDate,exchange,exchangeReceipt,arrayReferenceQuantity
            ,storeId,deliveryCompanyId,reduction,sponsorId} = req.body

        
        const result = validateOrder(req.body);
        if (result.error) {
            return res.status(400).send(result.error.details[0].message);
        }

        const store = await Store.findByPk(storeId)
     
        if(!store){
            return res.status(500).send("store doesn't existe");
        }


        const transaction = await db.sequelize.transaction();

        for (let i = 0; i < arrayReferenceQuantity.length; i++) {
            // const product = await Product.findByPk(arrayReferenceQuantity[i].productId);
            // if(!product) {
            //     return res.status(500).send({ error: 'product not found' });
            // }

            const reference = await Reference.findByPk(arrayReferenceQuantity[i].referenceId);
            if(!reference) {
                return res.status(500).send({ error: 'reference not found' });
            }

            if(orderStatus || orderStatus!='ANNULÉ'){
                // if(product.stock < arrayReferenceQuantity[i].quantity) {
                //     return res.status(500).send({ error: 'product out of stock' });
                // }
                // product.stock -= arrayReferenceQuantity[i].quantity;

                if(reference.quantity < arrayReferenceQuantity[i].quantity) {
                    return res.status(500).send({ error: 'product out of stock' });
                }
                reference.quantity -= arrayReferenceQuantity[i].quantity;
            }
            await reference.save({transaction});
            //await product.save({transaction});
        }


        //gain a caluculer
        const order = await Order.create({
            clientName,
            phoneNumber,
            address,
            city,
            region,
            deliveryPrice,
            sellPrice,
            totalAmount,
            orderStatus,
            note,
            collectionDate,
            exchange,
            exchangeReceipt,
            gain:0,
            storeId: store.id,
            deliveryCompanyId,
            reduction,
            sponsorId
        },{transaction}).then(async (order) => {
            let data = arrayReferenceQuantity.map((item)=>{
                return {...item,orderId:order.id}
            })

            await OrderReference.bulkCreate(data,{transaction})
          });

        await transaction.commit();

        res.status(200).send({ message:"order created" });
    } catch (error) {
        res.status(500).send({
            status:500,
            error:"server",
            message : error.message
        }); 
    }
}


exports.getOrderById = async function (req,res){
    try {
        const order = await Order.findOne({
            where:{id:req.query.id},
            include:[{model:Reference,
                    include:[{model:Product}]},
                {model:Store},
                {model:DeliveryCompany},
                {model:Sponsor}]
        })

        if(!order){
            return res.status(500).send('order does not exist!')
        }
        res.status(200).send(order);
    } catch (error) {
      res.status(500).send({
        status:500,
        error:"server",
        message : error.message
    });
    }
} 

exports.updateOrder = async function(req,res){
    try {
        const {clientName,phoneNumber,address,city,region,deliveryPrice,sellPrice,
            totalAmount,orderStatus,note,collectionDate,exchange,exchangeReceipt,arrayReferenceQuantity
            ,storeId,deliveryCompanyId,reduction,sponsorId} = req.body

        const transaction = await db.sequelize.transaction();

        const order = await Order.findOne({where:{id:req.query.id},
        include:[{model:Reference}]})

        if(!order){
            return res.status(500).send('order does not exist!')
        }

    // Get the current products in the order
    const currentReferences = await order.getReferences();

    // Find the products to add and update
    const referenceToAddOrUpdate =  await Promise.all(arrayReferenceQuantity.map(async (element) => {
        const reference = await Reference.findByPk(element.referenceId)
        if(!reference) {
            return res.status(500).send({ error: 'reference not found' });
        }

        if(reference.quantity < element.quantity) {
            return res.status(500).send({ error: `reference ${element.referenceId} out of stock` });
        }
      const existingReference = await currentReferences.find(f => f.id === element.referenceId);
      if (existingReference) {
        // If the Reference already exists in the order, update its quantity
        return {
            referenceId: existingReference.id,
          orderId:order.id,
            quantity: element.quantity
       
        };
      } else {
        // If the product is new to the order, add it with the given quantity
        return {
            referenceId: element.referenceId,
            orderId:order.id,
            quantity: element.quantity
          
        };
      }
    }));


    // Find the product IDs to delete
    const referenceIdsToDelete = currentReferences.filter(
        (p) => !arrayReferenceQuantity.map((c) => c.referenceId).includes(p.id)
        );
    // Update the order's products and quantities
    //await order.addReferences(referenceToAddOrUpdate);
    const updateOnDuplicate = ['quantity'];
    await OrderReference.bulkCreate(referenceToAddOrUpdate, { updateOnDuplicate });
    if (referenceIdsToDelete.length > 0) {
      await order.removeReferences(referenceIdsToDelete);
    }

            
            if((order.orderStatus=='ANNULÉ' )&& orderStatus==('CONFIRMÉ'||'EMBALLÉ'||
            'PRÊT'||'EN COURS'||'LIVRÉ'||'PAYÉ'))//-1
            {
                for (let i = 0; i < order.references.length; i++) {
                    const reference = await Reference.findByPk(order.references[i].id);
                    if(!reference) {
                        return res.status(500).send({ error: 'reference not found' });
                    }

                    // Subtract the quantity ordered from the stock
                    // if(product.stock < order.references[i].orderReferences.quantity) {
                    //     return res.status(500).send({ error: 'product reference out of stock' });
                    // }
                    reference.quantity -= order.references[i].orderProducts.quantity;
                    await reference.save({transaction});
                } 
            }
            
            else if(order.orderStatus==('CONFIRMÉ'||'EMBALLÉ'||
            'PRÊT'||'EN COURS'||'LIVRÉ'||'PAYÉ') && (orderStatus=='ANNULÉ' ))//+1
            {
                for (let i = 0; i < order.references.length; i++) {
                    const reference = await Reference.findByPk(order.references[i].id);
                    if(!reference) {
                        return res.status(500).send({ error: 'reference not found' });
                    }

                    // Subtract the quantity ordered from the stock
                    // if(product.stock < order.references[i].orderReferences.quantity) {
                    //     return res.status(500).send({ error: 'product reference out of stock' });
                    // }
                    reference.quantity += order.references[i].orderProducts.quantity;
                    await reference.save({transaction});
                } 
    
            }

            else if(order.orderStatus==('RETOUR'||'RETOUR REÇU')&&order.exchangeReceipt&&order.exchange)//+1
            {
                for (let i = 0; i < order.references.length; i++) {
                    const reference = await Reference.findByPk(order.references[i].id);
                    if(!reference) {
                        return res.status(500).send({ error: 'reference not found' });
                    }

                    // Subtract the quantity ordered from the stock
                    // if(product.stock < order.references[i].orderReferences.quantity) {
                    //     return res.status(500).send({ error: 'product reference out of stock' });
                    // }
                    reference.quantity += order.references[i].orderProducts.quantity;
                    await reference.save({transaction});
                } 
    
            }
        

        await Order.update(req.body,{where:{id:req.query.id}},{transaction});
        await transaction.commit()

        res.status(200).send({ message: "Order updated"});
    } catch (error) {
        console.log(error)
      res.status(500).send({
        status:500,
        error:"server",
        message : error.message
    });
    }
  }

  exports.deleteOrder = async function(req,res){
    await Order.findByPk(req.query.id)
      .then(order => {
        if (!order) {
          return res.status(500).send({ message: 'order not found' });
        }
        return order.destroy()
          .then(() => res.status(200).send({ message: 'order deleted successfully' }));
      })
      .catch(error => res.status(400).send(error));
  };


  exports.getAllOrderByStoreId= async function (req,res){
    const orders = await Order.findAll({where:{storeId:req.query.id}})
    res.status(200).send(orders)
  }

  exports.searchOrder = async function(req,res){
    try {
        const {clientName,phoneNumber,id} = req.query;
  
        let query;
        
        if ( clientName || phoneNumber ) {
            query = await Order.findAll({
                    where: {
                      clientName: { [Op.like]: `%${clientName}%` } ,
                      phoneNumber: { [Op.like]: `%${phoneNumber}%` },
                      storeId:id
                    }
                });
        } else {
            query = await Order.findAll({where:{storeId:id}});
        }
        res.status(200).send(query);
    } catch (error) {
        res.status(500).send({
            error:"server",
            message : error.message
        }); 
    }
  }

  exports.searchPackage = async function(req,res){
    try {
        const {clientName,phoneNumber,id} = req.query;
  
        let query;
        
        if ( clientName || phoneNumber ) {
            query = await Order.findAll({
                    where: {
                      clientName: { [Op.like]: `%${clientName}%` } ,
                      phoneNumber: { [Op.like]: `%${phoneNumber}%` },
                      orderStatus: {[Op.in]: ['CONFIRMÉ','EMBALLÉ','PRÊT','EN COURS','LIVRÉ','PAYÉ']},
                      storeId:id
                    }
                });
        } else {
            query = await Order.findAll({where:{
                storeId:id,
                orderStatus: {[Op.in]: ['CONFIRMÉ','EMBALLÉ','PRÊT','EN COURS','LIVRÉ','PAYÉ']}
            }});
        }
        res.status(200).send(query);
    } catch (error) {
        res.status(500).send({
            error:"server",
            message : error.message
        }); 
    }
  }