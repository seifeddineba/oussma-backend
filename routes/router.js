module.exports = function (app) {
    const ownerController = require('../controllers/ownerController');
    const storeContoller = require('../controllers/sotreController');
    const storeUserController = require('../controllers/storeUserController');
    // owner
    app.post("/api/ownerService/signUpOwner", ownerController.signUpOwner);
    app.post("/api/AuthService/signin", ownerController.signin);

    // store
    app.post("/api/storeService/createStore", storeContoller.createStore);

    // user
    app.post("/api/userService/createUser", storeUserController.createUser);

    // role
}