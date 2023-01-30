const jwt = require("jsonwebtoken");
const env = require("../config/env");

module.exports = (req, res, next) => {
  const token = req.headers['x-auth'];
  if (!token)
  return res
    .status(401)
    .json({ message: "Access denied. No token provided." });

 /*  let cookies = {};

  const cookiesArray = token?.split(';');

    cookiesArray.forEach((cookie) => {
        const [key, value] = cookie.trim().split('=');
        cookies[key] = value;
    }); */
   let cookie = token



  //console.log( atob(cookie.split('.')[1]).exp )


  try {
    const decoded = jwt.verify(cookie, env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};