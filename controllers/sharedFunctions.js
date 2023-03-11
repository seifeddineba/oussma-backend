const db = require("../config/dbConfig");
const path = require('path')
const fs = require('fs')
const mime = require('mime');

const User = db.user;
const Owner = db.owner;
const Store = db.store;
const StoreUser = db.storeUser;
const Subscription = db.subscription;
const Product = db.product;


module.exports.getUser = async function(id) {
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

module.exports.getUserSubscription = async function(userId){
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

module.exports.getStoreForOwner = async function(ownerId) {
  try{
     const store = await Store.findOne({
        where: { ownerId},
      })
      return store; 
  }catch(error){
    console.log(error)
  }
}

module.exports.generateRandomString =  async function() {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// module.exports.getProduct = async function getProduct(id) {
//   try{
//      const product = await Product.findByPk(id)
//       return product; 
//   }catch(error){
//     console.log(error)
//   }
// }

module.exports.uploadFile = async function (data){
  const base64Data = data.replace(/^data:([A-Za-z-+/]+);base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');
  const fileType = data.match(/^data:([A-Za-z-+/]+);base64/)[1];
  const fileExtension = mime.getExtension(fileType);
  const randomString = await makeid()
  const fileName = randomString+"."+fileExtension
  const filePath = path.join(__dirname, '../uploads/', fileName);

 await fs.writeFile(filePath, buffer, error => {
    // if (error) {
    //   return ('Error saving file')
    // } else {
    //   return fileName;
    // }
  });

  return fileName;

} 

module.exports.generateFactureCode = async function generateFactureCode(id) {
  const paddedId = String(id).padStart(8, '0');
  const factureCode = `FAC${paddedId}`;
  return factureCode;
}


async function makeid() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < 40) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
