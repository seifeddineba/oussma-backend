const auth = require('../middleware/auth');

module.exports = function (app) {
    const ownerController = require('../controllers/ownerController');
    const storeContoller = require('../controllers/sotreController');
    const storeUserController = require('../controllers/storeUserController');
    const authController = require('../controllers/authController');


    //auth
    app.post("/api/AuthService/signin", authController.signin);

    // owner
    app.post("/api/ownerService/signUpOwner", ownerController.signUpOwner);
    
    // store
    app.post("/api/storeService/createStore", auth, storeContoller.createStore);

    // user
    app.post("/api/userService/createStoreUser", auth, storeUserController.createStoreUser);


}