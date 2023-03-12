const db = require('../config/dbConfig');
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



exports.getstatisticsForOrderAndPackage = async function(req, res){

    try {
        const orderStatusCounts = await Order.findAll({
            attributes: ['orderStatus', [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'count']],
            group: ['orderStatus']
          });
          
          // Calculate the number of orders for each status
          const result = {};
          orderStatusCounts.forEach(statusCount => {
            result[statusCount.orderStatus] = statusCount.get('count');
          });
      
          res.status(200).send(result);
    } catch (error) {
        res.status(500).send({
            error:"server",
            message : error.message
        }); 
    }

}

exports.getstatisticsTotalAmount = async function(req, res){
    
    try {

        const {orderStatus,period}= req.query

        let timeForm = '%x-%v'
        if(period === 'month'){
            timeForm= '%m/%Y'
        }else if(period === 'year'){
            timeForm= '%Y'
        }

        const statistics = await Order.findAll({
            attributes: [
              [db.Sequelize.fn('DATE_FORMAT', db.Sequelize.col('created_at'), timeForm), period],
              [db.Sequelize.fn('sum', db.Sequelize.col('totalAmount')), 'totalAmount'],
            ],
            group: [db.Sequelize.fn('DATE_FORMAT', db.Sequelize.col('created_at'), timeForm)],
            where: {
              orderStatus: orderStatus
            },
          });
          
          res.status(200).send(statistics);
    } catch (error) {
        res.status(500).send({
            error:"server",
            message : error.message
        }); 
    }

}

exports.getstatisticsGain = async function(req, res){
    
    try {

        const {orderStatus,period}= req.query

        let timeForm = '%x-%v'
        if(period === 'month'){
            timeForm= '%m/%Y'
        }else if(period === 'year'){
            timeForm= '%Y'
        }

        const statistics = await Order.findAll({
            attributes: [
              [db.Sequelize.fn('DATE_FORMAT', db.Sequelize.col('created_at'), timeForm), period],
              [db.Sequelize.fn('sum', db.Sequelize.col('gain')), 'gain'],
            ],
            group: [db.Sequelize.fn('DATE_FORMAT', db.Sequelize.col('created_at'), timeForm)],
            where: {
              orderStatus: orderStatus
            },
          });
          
          res.status(200).send(statistics);
    } catch (error) {
        res.status(500).send({
            error:"server",
            message : error.message
        }); 
    }

}

exports.getMostSoldProduct = async function(req,res){
    try {
        const mostSoldProducts = await Product.findAll({
            order: [['quantityReleased', 'DESC']],
            limit: 20 
          });

          res.status(200).send(mostSoldProducts)
    } catch (error) {
        res.status(500).send({
            error:"server",
            message : error.message
        }); 
    }
}


