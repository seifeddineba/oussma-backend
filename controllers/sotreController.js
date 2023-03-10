const { owner } = require('../config/dbConfig');
const db = require('../config/dbConfig');
const {validateStore, isEmptyObject} = require('../models/validator');
const { getUser, getUserSubscription, uploadFile } = require('./sharedFunctions');
const { Op } = require('sequelize');

const User = db.user;
const Owner = db.owner;
const Store = db.store;
const StoreUser = db.storeUser;
const Category = db.category;
const Vendor = db.vendor;
const DeliveryCompany = db.deliveryCompany;

exports.createStore = async function(req,res){
    try {
        const {storeName,email,phoneNumber,url,amount,payed,logo,taxCode} = req.body
        // validate the request body using the schema
       
        const result = validateStore(req.body);
        if (result.error) {
          return res.status(400).send(result.error.details[0].message);
        }

        const existingStoreName = await Store.findOne({ where: { storeName: storeName } });
        if (existingStoreName) {
            return res.status(500).send('store name already in used');
        }

        // checking the owner
        const user = await getUser(req.user.id)

        // getPermisson
        const subscription = await getUserSubscription(user.id)
        if(subscription){    
          if(new Date(subscription.endDate).getTime()*1000<Date.now()){
            return res.status(500).send('your subsicription is over');
          }
          const nbstores = Store.count({ where: { ownerId :user.owner.id } });
          if(nbstores>=subscription.storeAllowed){
            return res.status(500).send('you passed the limit of allowed stores!');
          }
        }
       
          const {owner} = user
     
            if(!owner){
                return res.status(500).send("owner doesn't existe");
            }

            let fileName = ""
            if(logo){
              fileName= await uploadFile(logo)
            }
            
            // create new store
            const store = await Store.create({
              storeName,
              email,
              phoneNumber,
              url,
              amount,
              payed,
              logo:fileName,
              taxCode,
              ownerId: owner.id,
            });
            res.status(200).send({ message:"store created" });
         
      } catch (error) {
        res.status(500).send({
          status:500,
          error:"server",
          message : error.message
      }); 
      }
}

exports.getStoreById = async function (req,res){
  try {
    let  store = await Store.findOne({
      where: { id: req.query.id }
    });

      if(!store){
          return res.status(500).send('store does not exist!')
      }

      const nbPackage = await store.getOrders({ where: {
        orderStatus: { [Op.or]: ['CONFIRM??','EMBALL??','PR??T','EN COURS','LIVR??','PAY??'] } 
        } })
      const nbOrder = await store.getOrders({ where: {
        orderStatus: { [Op.notIn]: ['CONFIRM??','EMBALL??','PR??T','EN COURS','LIVR??','PAY??'] } 
        } })


      res.status(200).send({store:store,nbPackage:nbPackage.length,nbOrder:nbOrder.length});
  } catch (error) {
    res.status(500).send({
      status:500,
      error:"server",
      message : error.message
  });
  }
}

exports.updateStore = async function(req,res){
  try {

   
    if(isEmptyObject(req.body)){
      return res.status(400).send('All fields should not be empty')
    }

    let data = req.body

    if(req.body.logo){
      const fileName =  await uploadFile(req.body.logo)
      data.logo = fileName
    }
    
    await Store.update(data,{where:{id:req.query.id}});

      res.status(200).send({ message:"Store Updated" });
  } catch (error) {
    res.status(500).send({
      status:500,
      error:"server",
      message : error.message
  });
  }
}

exports.deleteStore = async function(req,res){
  try {
    await Store.findByPk(req.query.id)
    .then(store => {
      if (!store) {
        return res.status(500).send({ message: 'store not found' });
      }
      return store.destroy()
        .then(() => res.status(200).send({ message: 'store deleted successfully' }));
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


exports.getAllStoresByOwnerId = async function(req,res){
  const stores = await Store.findAll({where:{ownerId:req.query.id}})
  res.status(200).send(stores)
}

  
exports.searchStore = async function(req,res){
  try {
      const {storeName,phoneNumber,id} = req.query;

      let query;
      
      if ( storeName || phoneNumber ) {
          query = await Store.findAll({
                  where: {
                    storeName: { [Op.like]: `%${storeName}%` } ,
                    phoneNumber: { [Op.like]: `%${phoneNumber}%` } ,
                    ownerId:id
                  },
                  include: [{
                    model: StoreUser,
                    attributes: [[db.Sequelize.fn('COUNT', 'storeUsers.id'), 'storeUsersCount']]
                  }]
              });
      } else {
          query = await Store.findAll({where:{ownerId:id},include: [{
            model: StoreUser,
            attributes: [[db.Sequelize.fn('COUNT', 'storeUsers.id'), 'storeUsersCount']]
          }]});
      }

      let stores = []
      for (let index = 0; index < query.length; index++) {
        const store = query[index];

        const nbPackage = await store.getOrders({ where: {
          orderStatus: { [Op.or]: ['','ANNUL??','CONFIRM??','EMBALL??','EN ATTENTE','PR??T','CONFIRM??/ARTICLE NON DISPONIBLE','PAS DE R??PONSE'] } 
          } })
        const nbOrder = await store.getOrders({ where: {
          orderStatus: { [Op.or]: ['EN COURS','RETOUR','RETOUR RE??U','RETOUR PAY??','LIVR??','PAY??'] } 
          } })
        
        stores.push({...store.dataValues,nbPackage:nbPackage.length,nbOrder:nbOrder.length})
        
      }

      res.status(200).send(stores);
  } catch (error) {
      res.status(500).send({
          error:"server",
          message : error.message
      }); 
  }
}

exports.getAllStoreForOwnerOrStoreUser = async function (req,res) {
  try {
    
    const {ownerId,storeUserId}=req.query
    let stores = []
    if(ownerId){
      stores = await Store.findAll({where : {
        ownerId
      }})
    }else{
      //get the store
      const storeUser = await StoreUser.findByPk(storeUserId)

      const store = await Store.findByPk(storeUser.storeId)
      // get the owner
      stores = await Store.findAll({where : {
        ownerId:store.ownerId
      }})
    }

    res.status(200).send(stores);
  } catch (error) {
    res.status(500).send({
      error:"server",
      message : error.message
  }); 
  }

}

exports.getAllRelatedToStore = async function (req,res) {
  try{
    
    await Store.findAll({
      where: {
        id: {
          [Op.in]: req.body.storeIds
        } // Replace with the IDs of the stores you want to retrieve
      },
      include:[
        {model: Vendor},
        {model: Category},
        {model: DeliveryCompany}
      ]
      
    }).then(stores => {
      res.status(200).send(stores);
    });
  } catch (error) {
    res.status(500).send({
      error:"server",
      message : error.message
    }); 
  }
}