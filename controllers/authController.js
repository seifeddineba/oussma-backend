const db = require('../config/dbConfig');
const bcrypt = require('bcrypt');
const { getUserSubscription, getUser ,getStoreForOwner, generateRandomString } = require('./sharedFunctions');
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
        const token = jwt.sign({ id: user.id }, config.JWT_SECRET, { expiresIn: '24h' });
            

        //res.cookie('token', token, { httpOnly: true, maxAge: 60 * 60 * 24,domain:"127.0.0.1"})
        res.setHeader('x-auth', token);
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
        const {email}=req.body

        const owner = await Owner.findOne({where:{email}});

        if(!owner){
            return res.status(401).send({ error: 'Invalid owner' });
        }

        const password = await generateRandomString()
        console.log(password)

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.findOne({where:{id:owner.userId}})

        await user.update({password:hashedPassword})

        //await sendMail(password)

        return res.status(200).send({ message: 'password reseted and sent to your email' });

    } catch (error) {
        res.status(500).send({
            status:500,
            error:"server",
            message : error.message
        }); 
    }
}


async function sendMail (password,email){
    let transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      service: 'gmail',
      secure: false,
      auth: {
        user: '',
        pass: ''
      }
    });
    
    // Define the email options
    let mailOptions = {
      from: '"adnan-taxi-service" adtaxi92@gmail.com',
      to: email,
      subject: 'reset password',
      text: 'Votre mote de pass',
      html: `<p>Votre mote de pass : ${password}</p>`
    };
    
    // Send the email
    transport.sendMail(mailOptions, (err, data) => {
      if (err) {
        return res.status(400).send(err);
      }
    }); 
  }