const auth = require('../middleware/auth');

module.exports = function (app) {
    const ownerController = require('../controllers/ownerController');
    const storeContoller = require('../controllers/sotreController');
    const storeUserController = require('../controllers/storeUserController');
    const authController = require('../controllers/authController');
    const orderController = require('../controllers/orderController');
    const productController = require('../controllers/productController');
    const arrivalController = require('../controllers/arrivalController');
    const vendorController = require('../controllers/vendorController');
    const categoryController = require('../controllers/categoryController');
    const deliveryCompanyController = require('../controllers/deliveryCompanyController');
    const chargeController = require('../controllers/chargeController');


    //auth
    app.post("/api/authService/signin", authController.signin);
    app.get("/api/authService/getCurrentUser", auth,authController.getCurrentUser);

    // owner
    app.post("/api/ownerService/signUpOwner", ownerController.signUpOwner);
    
    // store
    app.post("/api/storeService/createStore", auth, storeContoller.createStore);

    // user
    app.post("/api/userService/createStoreUser", auth, storeUserController.createStoreUser);

    // order
    app.post("/api/orderService/createOrder", auth, orderController.createOrder);


    //product
    app.post("/api/productService/createProduct", auth, productController.createProduct)

    //arrival
    app.post("/api/arrivalService/createArrival", auth, arrivalController.createArrival)


    //vendor
    app.post("/api/vendorService/createVendor", auth, vendorController.createVendor)
    
    //category
    app.post("/api/categoryService/createCategory", auth, categoryController.createCategory)

    //deliveryCompany
    app.post("/api/deliveryCompanyService/createDeliveryCompany", auth, deliveryCompanyController.createDeliveryCompany)
    
    //charge
    app.post("/api/chargeService/createCharge", auth, chargeController.createCharge)
}