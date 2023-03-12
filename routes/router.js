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
    const sponsorController = require('../controllers/sponsorController');
    const subscriptionController = require('../controllers/subscriptionController');
    const kpiController = require('../controllers/kpiController');


    //auth
    app.post("/api/authService/signin", authController.signin);
    app.get("/api/authService/getCurrentUser", auth,authController.getCurrentUser);
    app.post("/api/authService/resetPassword",authController.resetPassword)

    // owner
    app.post("/api/ownerService/signUpOwner", ownerController.signUpOwner);
    app.get("/api/ownerService/getOwnerById", auth,ownerController.getOwnerById);
    app.put("/api/ownerService/updateOwner", auth,ownerController.updateOwner);
    app.delete("/api/ownerService/deleteOwner", auth,ownerController.deleteOwner);
    app.get("/api/ownerService/getAllStoreAndStoreUserByOwnerId", auth,ownerController.getAllStoreAndStoreUserByOwnerId);
    
    // store
    app.post("/api/storeService/createStore", auth, storeContoller.createStore);
    app.get("/api/storeService/getStoreById", auth, storeContoller.getStoreById);
    app.put("/api/storeService/updateStore", auth, storeContoller.updateStore);
    app.delete("/api/storeService/deleteStore", auth, storeContoller.deleteStore);
    app.get("/api/storeService/getAllStoresByOwnerId", auth, storeContoller.getAllStoresByOwnerId);
    app.get("/api/storeService/searchStore", auth, storeContoller.searchStore);
    app.get("/api/storeService/getAllStoreForOwnerOrStoreUser", auth, storeContoller.getAllStoreForOwnerOrStoreUser);
    app.post("/api/storeService/getAllRelatedToStore", auth, storeContoller.getAllRelatedToStore);    

    // user
    app.post("/api/userService/createStoreUser", auth, storeUserController.createStoreUser);
    app.get("/api/userService/getStoreUserById", auth, storeUserController.getStoreUserById);
    app.put("/api/userService/updateStoreUser", auth, storeUserController.updateStoreUser);
    app.delete("/api/userService/deleteStoreUser", auth, storeUserController.deleteStoreUser);
    app.get("/api/userService/getAllStoreUserByStoreId", auth, storeUserController.getAllStoreUserByStoreId);
    app.get("/api/userService/searchStoreUser", auth, storeUserController.searchStoreUser);

    // order
    app.post("/api/orderService/createOrder", auth, orderController.createOrder);
    app.get("/api/orderService/getOrderById", auth, orderController.getOrderById);
    app.put("/api/orderService/updateOrder", auth, orderController.updateOrder);
    app.delete("/api/orderService/deleteOrder", auth, orderController.deleteOrder);
    app.get("/api/orderService/getAllOrderByStoreId", auth, orderController.getAllOrderByStoreId);
    app.get("/api/orderService/searchOrder", auth, orderController.searchOrder);
    app.get("/api/orderService/searchPackage", auth, orderController.searchPackage);
    app.delete("/api/orderService/DeleteMultipleOrders", auth, orderController.DeleteMultipleOrders);
    app.put("/api/orderService/UpdateStatusForMultipleOrders", auth, orderController.UpdateStatusForMultipleOrders);
    app.get("/api/orderService/getDeliveryNoteForOrder", auth, orderController.getDeliveryNoteForOrder);



    //product
    app.post("/api/productService/createProduct", auth, productController.createProduct);
    app.get("/api/productService/getProductById", auth, productController.getProductById);
    app.put("/api/productService/updateProduct", auth, productController.updateProduct);
    app.delete("/api/productService/deleteProduct", auth, productController.deleteProduct);
    app.get("/api/productService/getAllProductByStoreId", auth, productController.getAllProductByStoreId);
    app.get("/api/productService/searchProduct", auth, productController.searchProduct);

    //arrival
    app.post("/api/arrivalService/createArrival", auth, arrivalController.createArrival);
    app.get("/api/arrivalService/getArrivalById", auth, arrivalController.getArrivalById);
    app.put("/api/arrivalService/updateArrival", auth, arrivalController.updateArrival);
    app.delete("/api/arrivalService/deleteArrival", auth, arrivalController.deleteArrival);
    app.get("/api/arrivalService/getAllArrivalByStoreId", auth, arrivalController.getAllArrivalByStoreId);
    app.get("/api/arrivalService/searchArrival", auth, arrivalController.searchArrival);
    app.post("/api/arrivalService/selectFileForArrival", auth, arrivalController.selectFileForArrival);
    app.get("/api/arrivalService/getAllArrivalForPorduct", auth, arrivalController.getAllArrivalForPorduct);

    //vendor
    app.post("/api/vendorService/createVendor", auth, vendorController.createVendor);
    app.get("/api/vendorService/getVendorById", auth, vendorController.getVendorById);
    app.put("/api/vendorService/updateVendor", auth, vendorController.updateVendor);
    app.delete("/api/vendorService/deleteVendor", auth, vendorController.deleteVendor);
    app.get("/api/vendorService/getAllVendorByStoreId", auth, vendorController.getAllVendorByStoreId);
    app.get("/api/vendorService/searchVendor", auth, vendorController.searchVendor);
    app.post("/api/vendorService/addFileToVendor", auth, vendorController.addFileToVendor);
    app.put("/api/vendorService/updateFileOfVendor", auth, vendorController.updateFileOfVendor);
    app.delete("/api/vendorService/deleteFileOfVendor", auth, vendorController.deleteFileOfVendor);
    
    
    //category
    app.post("/api/categoryService/createCategory", auth, categoryController.createCategory);
    app.get("/api/categoryService/getCategoryById", auth, categoryController.getCategoryById);
    app.put("/api/categoryService/updateCategory", auth, categoryController.updateCategory);
    app.delete("/api/categoryService/deleteCategory", auth, categoryController.deleteCategory);
    app.get("/api/categoryService/getAllCategoryByStoreId", auth, categoryController.getAllCategoryByStoreId);
    app.get("/api/categoryService/searchCategory", auth, categoryController.searchCategory);

    //deliveryCompany
    app.post("/api/deliveryCompanyService/createDeliveryCompany", auth, deliveryCompanyController.createDeliveryCompany);
    app.get("/api/deliveryCompanyService/getDeliveryCompanyById", auth, deliveryCompanyController.getDeliveryCompanyById);
    app.put("/api/deliveryCompanyService/updateDeliveryCompany", auth, deliveryCompanyController.updateDeliveryCompany);
    app.delete("/api/deliveryCompanyService/deleteDeliveryCompany", auth, deliveryCompanyController.deleteDeliveryCompany);
    app.get("/api/deliveryCompanyService/getAllDeliveryCompanyByStoreId", auth, deliveryCompanyController.getAllDeliveryCompanyByStoreId);
    app.get("/api/deliveryCompanyService/searchDeliveryCompany", auth, deliveryCompanyController.searchDeliveryCompany);

    //charge
    app.post("/api/chargeService/createCharge", auth, chargeController.createCharge);
    app.get("/api/chargeService/getChargeById", auth, chargeController.getChargeById);
    app.put("/api/chargeService/updateCharge", auth, chargeController.updateCharge);
    app.delete("/api/chargeService/deleteCharge", auth, chargeController.deleteCharge);
    app.get("/api/chargeService/getAllChargeByStoreId", auth, chargeController.getAllChargeByStoreId);
    app.get("/api/chargeService/searchCharge", auth, chargeController.searchCharge);

    //sponsor
    app.post("/api/sponsorService/createSponsor", auth, sponsorController.createSponsor);
    app.get("/api/sponsorService/getSponsorById", auth, sponsorController.getSponsorById);
    app.put("/api/sponsorService/updateSponsor", auth, sponsorController.updateSponsor);
    app.delete("/api/sponsorService/deleteSponsor", auth, sponsorController.deleteSponsor);
    app.get("/api/sponsorService/getAllSponsorByStoreId", auth, sponsorController.getAllSponsorByStoreId);
    app.get("/api/sponsorService/searchSponsor", auth, sponsorController.searchSponsor);

    //subscription
    app.get("/api/subscriptionService/getAllSubscription",subscriptionController.getAllSubscription);


    //kpi api 
    app.get("/api/kpiService/getstatisticsForOrderAndPackage", auth, kpiController.getstatisticsForOrderAndPackage);
    app.get("/api/kpiService/getstatisticsTotalAmount", auth, kpiController.getstatisticsTotalAmount);
    
}