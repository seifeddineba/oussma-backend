const db = require('../config/dbConfig');
const {validateOwner} = require('../models/validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const Owner = db.owner;
const Store = db.store;
const User = db.user;
const Role = db.role;


exports.signUpOwner = async function (req, res) {
    try {
        const {name,email,phoneNumber,login,password,accountType} = req.body
        // check if email is already in used

        const result = validateOwner(req.body);
        if (result.error) {
            return res.status(400).send(result.error.details[0].message);
        }

        const existingOwner = await Owner.findOne({ where: { email: email } });
        if (existingOwner) {
            return res.status(401).send('Email already in used');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        // create new owner
        const owner = await Owner.create({
            name: name,
            email: email,
            phoneNumber: phoneNumber,
            login: login,
            password: hashedPassword,
            accountType: accountType,
        });

        res.status(200).send({ message:"owner created" });
    } catch (error) {
        console.log(error)
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
        const owner = await Owner.findOne({ where: { login: login } });
        if (!owner) {
            return res.status(401).send({ error: 'Invalid login or password' });
        }
    
        // compare the password using bcrypt
        const passwordMatch = await bcrypt.compare(password, owner.password);
        if (!passwordMatch) {
          return res.status(402).send({ error: 'Invalid login or password' });
        }
    
        // create a JWT for the owner
        const token = jwt.sign({ id: owner.id }, "myapp", { expiresIn: '24h' });
    
        res.status(200).send({ token });
    } catch (error) {
        console.log(error)
    res.status(404).send(error);
    }
}