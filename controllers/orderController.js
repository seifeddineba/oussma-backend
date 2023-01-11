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
            totalAmount,orderStatus,note,collectionDate,arrayProductQuantity
            ,storeId,deliveryCompanyId,reduction,sponsorId} = req.body

        
        const result = validateOrder(req.body);
        if (result.error) {
            return res.status(400).send(result.error.details[0].message);
        }

        const store = await Store.findByPk(storeId)
     
        if(!store){
            return res.status(500).send("store doesn't existe");
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
            gain:0,
            storeId: store.id,
            deliveryCompanyId,
            reduction,
            sponsorId
        }).then(async (order) => {
            let data = arrayProductQuantity.map((item)=>{
                return {...item,orderId:order.id}
            })
            OrderProduct.bulkCreate(data).then(() => {
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
        const {clientName,phoneNumber,address,city,region,deliveryPrice,sellPrice,
            totalAmount,orderStatus,note,collectionDate,reduction,orderId} = req.body
  

      if(isEmptyObject(req.body)){
        return res.status(400).send('All fields should not be empty')
      }

      await Order.update(req.body,{where:{id:req.query.id}});

        res.status(200).send({ message:"Order Updated" });
    } catch (error) {
      res.status(500).send({
        status:500,
        error:"server",
        message : error.message
    });
    }
  }

  exports.deleteOrder = async function(req,res){
    Order.findByPk(req.query.id)
      .then(order => {
        if (!order) {
          return res.status(500).send({ message: 'order not found' });
        }
        return order.remove()
          .then(() => res.send({ message: 'order deleted successfully' }));
      })
      .catch(error => res.status(400).send(error));
  };