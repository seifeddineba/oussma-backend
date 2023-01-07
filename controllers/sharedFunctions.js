const db = require("../config/dbConfig");

const User = db.user;
const Owner = db.owner;
const Store = db.store;
const StoreUser = db.storeUser;
const Subscription = db.subscription;
const Product = db.product;


module.exports.getUser = async function getUser(id) {
  try{
     const user = await User.findOne({
        attributes: ['id','fullName','created_at','updatedAt'],
        where: { id },
        include: [
          { model: Owner, as: "owner" },
          { model: StoreUser, as: "storeUser" },
        ],
      })
      return user; 
  }catch(error){
    console.log(error)
  }
}

module.exports.getUserSubscription = async function getUserSubscription (userId){
  try {
    const subscription = Subscription.findOne({
      where: { userId }
      //order: [['paymentDate', 'DESC']]
    });
    return subscription;
  } catch (error) {
    console.log(error)
  }
}


// module.exports.getStoreById = async function getStoreById(id) {
//   try{
//      const store = await Store.findByPk(id)
//       return store; 
//   }catch(error){
//     console.log(error)
//   }
// }

module.exports.getStoreForOwner = async function getStoreForOwner(ownerId) {
  try{
     const store = await Store.findOne({
        where: { ownerId},
      })
      return store; 
  }catch(error){
    console.log(error)
  }
}

// module.exports.getProduct = async function getProduct(id) {
//   try{
//      const product = await Product.findByPk(id)
//       return product; 
//   }catch(error){
//     console.log(error)
//   }
// }

