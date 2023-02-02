const db = require('../config/dbConfig');
const { validateOrder, isEmptyObject } = require('../models/validator');


const User = db.user;
const Owner = db.owner;
const Store = db.store;
const StoreUser = db.storeUser;
const Subscription = db.subscription;
const Order = db.order;
const Product = db.product;
const OrderProduct = db.orderProduct

exports.createOrder = async function (req, res) {
    try {
        const {clientName,phoneNumber,address,city,region,deliveryPrice,sellPrice,
            totalAmount,orderStatus,note,collectionDate,exchange,exchangeReceipt,arrayProductQuantity
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

        for (let i = 0; i < arrayProductQuantity.length; i++) {
            const product = await Product.findByPk(arrayProductQuantity[i].productId);
            if(!product) {
                return res.status(500).send({ error: 'product not found' });
            }
            // Subtract the quantity ordered from the stock
            if(orderStatus || orderStatus!='ANNULÉ'){
                if(product.stock < arrayProductQuantity[i].quantity) {
                    return res.status(500).send({ error: 'product out of stock' });
                }
                product.stock -= arrayProductQuantity[i].quantity;
            }
            await product.save({transaction});
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
            let data = arrayProductQuantity.map((item)=>{
                return {...item,orderId:order.id}
            })
            OrderProduct.bulkCreate(data).then(async () => {
                await transaction.commit();
                res.status(200).send({ message:"order created" });
              });
          });
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
        const order = await Order.findByPk(req.query.id)
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
        const transaction = await db.sequelize.transaction();

      if(isEmptyObject(req.body)){
        return res.status(400).send('All fields should not be empty')
      }
      
       if (req.body.orderStatus){

        const {orderStatus} = req.body

        const order = await Order.findOne({where:{id:req.query.id},
            include:[{model:Product}]})
            if(!order){
                return res.status(500).send('order does not exist!')
            }
            
            if((order.orderStatus=='ANNULÉ' )&& orderStatus==('CONFIRMÉ'||'EMBALLÉ'||
            'PRÊT'||'EN COURS'||'LIVRÉ'||'PAYÉ'))//-1
            {
                for (let i = 0; i < order.products.length; i++) {
                    const product = await Product.findByPk(order.products[i].id);
                    if(!product) {
                        return res.status(500).send({ error: 'product not found' });
                    }
                    // Subtract the quantity ordered from the stock
                    if(product.stock < order.products[i].orderProducts.quantity) {
                        return res.status(500).send({ error: 'product out of stock' });
                    }
                    product.stock -= order.products[i].orderProducts.quantity;
                    await product.save({transaction});
                } 
            }
            
            else if(order.orderStatus==('CONFIRMÉ'||'EMBALLÉ'||
            'PRÊT'||'EN COURS'||'LIVRÉ'||'PAYÉ') && (orderStatus=='ANNULÉ' ))//+1
            {
                for (let i = 0; i < order.products.length; i++) {
                    const product = await Product.findByPk(order.products[i].id);
                    if(!product) {
                        return res.status(500).send({ error: 'product not found' });
                    }
                    // ADD the quantity ordered fro the stock
            
                    product.stock += order.products[i].orderProducts.quantity;
                    await product.save({transaction});
                } 
    
            }

            else if(order.orderStatus==('RETOUR'||'RETOUR REÇU')&&order.exchangeReceipt&&order.exchange)//+1
            {
                for (let i = 0; i < order.products.length; i++) {
                    const product = await Product.findByPk(order.products[i].id);
                    if(!product) {
                        return res.status(500).send({ error: 'product not found' });
                    }
                    // ADD the quantity ordered fro the stock
                    product.stock += order.products[i].orderProducts.quantity;
                    await product.save({transaction});
                } 
    
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