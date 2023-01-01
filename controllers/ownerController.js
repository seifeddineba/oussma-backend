const db = require('../config/dbConfig');
const {validateOwner} = require('../models/validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = db.user;
const Owner = db.owner;
const Store = db.store;
const StoreUser = db.storeuser;
const Role = db.role;


exports.signUpOwner = async function (req, res) {
    try {
        const {name,email,phoneNumber,login,password,accountType} = req.body
        // check if email is already in used

        const result = validateOwner(req.body);
        if (result.error) {
            return res.status(400).send(result.error.details[0].message);
        }

        const existingOwner = await User.findOne({ where: { login: login } });
        if (existingOwner) {
            return res.status(401).send('login already in used');
        }

        const hashedPassword = await bcrypt.hash(password, 10);


        const transaction = await db.sequelize.transaction();

        const user = await User.create({
            name,
            login,
            password: hashedPassword
          }, { transaction });


        const owner = await Owner.create({
            email,
            phoneNumber: phoneNumber,
            accountType,
            userId: user.id
        }, { transaction });


        await transaction.commit();

        res.status(200).send({ message:"owner created" });
    } catch (error) {
        console.log(error)
        if (transaction) await transaction.rollback();{
            res.status(500).send(err);  
        }

        res.status(404).send(error);
    }
}

exports.signin = async function(req,res){
    try {
        // find the owner by login
        const {login,password} = req.body
        if( !login&&!password){
            return res.status(400).send({ error: 'missing login or password' });
        }
        const user = await User.findOne({ 
            where: { login: login },
            include:[
                { model:Owner, as:"owner" },
                { model:StoreUser, as:"storeUser" }
            ]
        });
        if (!user) {
            return res.status(401).send({ error: 'Invalid login' });
        }
    
        // compare the password using bcrypt
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return res.status(402).send({ error: 'Invalid password' });
        }
    
        // create a JWT for the user
        const token = jwt.sign({ id: user.id }, "myapp", { expiresIn: '24h' });
    
        res.status(200).send({ token :token,user });
    } catch (error) {
        console.log(error)
    res.status(404).send(error);
    }
}