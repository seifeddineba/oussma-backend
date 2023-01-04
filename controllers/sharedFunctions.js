const db = require("../config/dbConfig");

const User = db.user;
const Owner = db.owner;
const StoreUser = db.storeUser;
const Subscription = db.subscription;


async function getUser(id) {
  try{
     const user = await User.findOne({
        where: { id: id },
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

async function getOwnerSubscription (ownerId){
  try {
    const subscription = Subscription.findOne({
      where: { ownerId },
      order: [['paymentDate', 'DESC']]
    });
    return subscription;
  } catch (error) {
    console.log(error)
  }
}

module.exports.getUser = getUser;
module.exports.getOwnerSubscription = getOwnerSubscription;
