const db = require('../config/dbConfig');
const {validateOwner} = require('../models/validator');
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
            ownerId:owner.id
        }, { transaction })

        await transaction.commit();

        res.status(200).send({ message:"owner created" });
    } catch (error) {
        console.log(error)
        if (transaction) await transaction.rollback();{
            res.status(500).send(err);  
        }

        res.status(500).send(error);
    }
}