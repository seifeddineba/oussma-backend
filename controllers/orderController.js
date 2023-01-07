const db = require('../config/dbConfig');
const { validateOrder } = require('../models/validator');


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
        const {clientName,phoneNumber,address,deliveryPrice,sellPrice,
            totalAmount,orderStatus,note,collectionDate,arrayProductQuantity
            ,storeId,deliveryCompanyId} = req.body

        
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
            deliveryPrice,
            sellPrice,
            totalAmount,
            orderStatus,
            note,
            collectionDate,
            gain:0,
            storeId: store.id,
            deliveryCompanyId
        }).then(async (order) => {
            let data = arrayProductQuantity.map((item)=>{
                return {...item,orderId:order.id}
            })
            OrderProduct.bulkCreate(data).then(() => {
                res.status(200).send({ message:"order created" });
              });
            //   console.log(order.id)
            //   const rerer = await Order.findOne({
            //       where: {
            //         id: 20
            //       },
            //       include: [{
            //         model: Product,
            //         as: 'products',
            //       }]
            //     })
            //     res(rerer)
          });
    } catch (error) {
        res.status(500).send({
            status:500,
            error:"server",
            message : error.message
        }); 
    }
}