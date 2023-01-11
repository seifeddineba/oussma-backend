const db = require('../config/dbConfig');
const bcrypt = require('bcrypt');
const { getUserSubscription, getUser ,getStoreForOwner } = require('./sharedFunctions');
const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { serialize } = require('cookie') ;


const User = db.user;
const Owner = db.owner;
const Store = db.store;
const StoreUser = db.storeUser;
const Subscription = db.subscription;

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


        // getPermisson
        const subscription = await getUserSubscription(user.id)

        let store
        if(user.owner){
            store = await getStoreForOwner(user.owner.id)
        }
        if(user.storeUser){
            store = await Store.findByPk(user.storeUser.storeId)
        }
        
        
    
        // create a JWT for the user
        const token = jwt.sign({ id: user.id }, env.JWT_SECRET, { expiresIn: '24h' });
        const serialized = serialize('token', token, 
           { httpOnly: true},
           { maxAge: 60 * 60 * 24} 
        );

        res.cookie('token', serialized)
        res.status(200).send({ user , subscription, store });
    } catch (error) {
        res.status(500).send({
            status:500,
            error:"server",
            message : error.message
        }); 
    }
}

exports.getCurrentUser = async function(req,res){
    try {
        const user = await getUser(req.user.id)
        const subsicription = await getUserSubscription(req.user.id)
        if (!user) {
            return res.status(401).send({ error: 'Invalid user' });
        }
        if (!subsicription) {
            return res.status(401).send({ error: 'Invalid subsicription' });
        }

        let store
        if(user.owner){
            store = await getStoreForOwner(user.owner.id)
        }
        if(user.storeUser){
            store = await Store.findByPk(user.storeUser.storeId)
        }

        res.status(200).send({ user , subsicription ,store});
    } catch (error) {
        res.status(500).send({
            status:500,
            error:"server",
            message : error.message
        }); 
    }
}

exports.resetPassword = async function (req,res){
    try {
        const {password}=req.body

        const user = await User.findByPk(req.user.id);

        if(!user){
            return res.status(401).send({ error: 'Invalid user' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await user.update({password:hashedPassword})
    } catch (error) {
        res.status(500).send({
            status:500,
            error:"server",
            message : error.message
        }); 
    }
}