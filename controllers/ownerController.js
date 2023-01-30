const db = require('../config/dbConfig');
const {validateOwner, isEmptyObject} = require('../models/validator');
const bcrypt = require('bcrypt');


const User = db.user;
const Owner = db.owner;
const Store = db.store;
const StoreUser = db.storeUser;
const Subscription = db.subscription;


exports.signUpOwner = async function (req, res) {
    try {
        const {fullName,email,phoneNumber,login,password} = req.body
        // check if email is already in used

        const result = validateOwner(req.body);
        if (result.error) {
            return res.status(400).send(result.error.details[0].message);
        }

        const existingOwner = await User.findOne({ where: { login: login } });
        if (existingOwner) {
            return res.status(500).send('login already in used');
        }

        const hashedPassword = await bcrypt.hash(password, 10);


        const transaction = await db.sequelize.transaction();

        const user = await User.create({
            fullName,
            login,
            password: hashedPassword
          }, { transaction });


        const owner = await Owner.create({
            email,
            phoneNumber,
            userId: user.id
        }, { transaction });

        const originalDate = new Date();
        const newDate = originalDate.setDate(originalDate.getDate() + 14);
        const subscription = await Subscription.create({
            description: "FREE_TARIL",
            period: 14,
            endDate: newDate,
            price: 0,
            storeAllowed: 1,
            userAllowed: 5,
            userId:user.id
        }, { transaction })

        await transaction.commit();

        res.status(200).send({ message:"owner created" });
    } catch (error) {
        res.status(500).send({
            status:500,
            error:"server",
            message : error.message
        }); 
    }
}

exports.getOwnerById = async function (req,res){
    try {
        const owner = await Owner.findByPk(req.query.id)
        if(!owner){
            return res.status(500).send('owner does not exist!')
        }
        res.status(200).send(owner);
    } catch (error) {
        res.status(500).send({
            status:500,
            error:"server",
            message : error.message
        });
    }
}

exports.updateOwner = async function(req,res){
    try {
      const {fullName,login,email,phoneNumber,userId}=req.body
  
      if(isEmptyObject(req.body)){
        return res.status(400).send('All fields should not be empty')
      }

      const existingLogin = User.findOne({where:{login:login}})

      if(existingLogin){
        return res.status(500).send('Login already in use !')
      }
  
      const user = await User.findOne({ where: { id: req.query.id } });
  
      //const hashedPassword = await bcrypt.hash(password, 10);
  
      await user.update({fullName,login});//password:hashedPassword
      
      await Owner.update(
        {email,phoneNumber}, 
        { where: {userId:user.id} });
  
        res.status(200).send({ message:"Owner Updated" });
    } catch (error) {
      res.status(500).send({
        status:500,
        error:"server",
        message : error.message
    });
    }
  }

  exports.deleteOwner = async function(req,res){
    await Owner.findByPk(req.query.id)
      .then(owner => {
        if (!owner) {
          return res.status(500).send({ message: 'owner not found' });
        }
        return owner.destroy()
          .then(() => res.status(200).send({ message: 'owner deleted successfully' }));
      })
      .catch(error => res.status(400).send(error));
  };