const Joi = require('joi');

module.exports.validateOwner = async function validateOwner(owner) {
    const schema = Joi.object({
        fullName: Joi.string().required(),
        email: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        login: Joi.string().required(),
        password: Joi.string().min(6).required(),
        //accountType: Joi.string().valid('freeTrail', 'offer').required()
    });

    return schema.validate(owner);
}

module.exports.validateStore = async function validateStore(store){
    const schema = Joi.object().keys({
        storeName: Joi.string().required(),
        email: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        url: Joi.string().required(),
        amount: Joi.number().required(),
        payed: Joi.number().required(),
        logo: Joi.string().optional().allow(''),
        taxCode: Joi.string().required(),
        //ownerId: Joi.number().required(),
    });
    return schema.validate(store);
}

module.exports.validateStoreUser = async function validateStoreUser(storeUser){
    const schema = Joi.object().keys({
        fullName: Joi.string().required(),
        login: Joi.string().required(),
        password: Joi.string().min(6).required(),
        salary: Joi.number().required().allow(""),
        permissionType: Joi.string().valid('VENDEUR', 'CHEF', 'RESPONSABLE').required(),
        storeId: Joi.number().required()
    });
    return schema.validate(storeUser);
}


module.exports.validateSubscription = async function validateSubscription(subscription){
    const schema = Joi.object().keys({
        description: Joi.string().required(),
        period: Joi.number().required(),
        endDate: Joi.date().required(),
        price: Joi.number().required(),
        storeAllowed: Joi.number().required(),
        userAllowed: Joi.number().required()
    })
    return schema.validate(subscription)
}

module.exports.validateOrder = async function validateOrder(order){
    const schema = Joi.object().keys({
        clientName: Joi.string().optional().allow(''),
        phoneNumber: Joi.string().optional().allow(''),
        address: Joi.string().required(),
        city: Joi.string().required().allow(''),
        //region: Joi.string().required(),
        deliveryPrice: Joi.number().required(),
        sellPrice: Joi.number().required(),
        totalAmount: Joi.number().required(),
        //gain: Joi.number().required(),
        orderStatus: Joi.string().valid('', 'ANNUL??', 'CONFIRM??','EMBALL??','EN ATTENTE',
        'PR??T','EN COURS','RETOUR','RETOUR RE??U',
        'RETOUR PAY??','LIVR??','PAY??','CONFIRM??/ARTICLE NON DISPONIBLE','PAS DE R??PONSE').required(),
        exchange: Joi.boolean().required(),
        exchangeReceipt: Joi.boolean().required(),
        note: Joi.string().required().allow(""),
        collectionDate: Joi.date().required(),
        arrayReferenceQuantity: Joi.array().items(Joi.object({referenceId:Joi.number().required(),quantity: Joi.number().required()})).required(),
        storeId: Joi.number().required(),
        deliveryCompanyId: Joi.number().required().allow(null),
        reduction: Joi.number().required().allow(null),
        sponsorId: Joi.number().required().allow(null),
    })
    return schema.validate(order)
}

module.exports.validateProduct = async function validateProduct(product){
    const schema = Joi.object().keys({
        productReference: Joi.string().required(),
        //quantityReleased: Joi.number().required(),
        stock: Joi.number().required(),
        purchaseAmount: Joi.number().required(),
        amoutSells: Joi.number().required(),
        storeIds: Joi.array().items(Joi.number()).required(),
        categoryId: Joi.number().required(),
        //sellerReference : Joi.string().required(),
        // name : Joi.string().required(),
        vendorId: Joi.number().required(),
        file: Joi.string().optional().allow(''),
        references:Joi.array().items(Joi.object({reference:Joi.string().required(),quantity: Joi.number().required()})).required(),
    })
    return schema.validate(product)
}

module.exports.validateArrival = async function validateArrival(arrival){
    const schema = Joi.object().keys({
        referencesQuantity: Joi.array().items(Joi.object({referenceId:Joi.number().required(),quantity: Joi.number().required()})).required(),
        buyingPrice: Joi.number().required(),
        amount: Joi.number().required(),
        //facture: Joi.string().required(),
        //arrivalDate: Joi.date().required(),
        productId: Joi.number().required(),
        vendorId: Joi.number().required(),
        fileId: Joi.number().required()
    })
    return schema.validate(arrival)
}


module.exports.validateVendor = async function validateVendor(vendor){
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        email : Joi.string().optional().allow(''),
        address : Joi.string().required(),
        phoneNumber: Joi.string().required(),
        note: Joi.string().required().allow(""),
        storeIds: Joi.array().items(Joi.number()).required(),
        //file: Joi.string().required(),
    })
    return schema.validate(vendor)
}

module.exports.validateCategory = async function validateCategory(category){
    const schema = Joi.object().keys({
        categoryName: Joi.string().required(),
        storeIds: Joi.array().items(Joi.number()).required()
    })
    return schema.validate(category)
}


module.exports.validateDeliveryCompany = async function validateDeliveryCompany(deliveryCompany){
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        note: Joi.string().required().allow(""),
        status: Joi.string().valid('ACTIVE', 'INACTIF').required(),
        deliveryPrice: Joi.number().required(),
        retourPrice: Joi.number().required(),
        logo: Joi.string().optional().allow(''),
        storeIds: Joi.array().items(Joi.number()).required()
    })
    return schema.validate(deliveryCompany)
}

module.exports.validateCharge = async function validateCharge(charge){
    const schema = Joi.object().keys({
        chargeType: Joi.string().valid('PAYMENT', 'CHARGE','ACHAT').required().allow(""),
        type: Joi.string().valid('RE??U','EFFECTU??').optional().allow(''),
        amount: Joi.number().required(),
        note: Joi.string().required().allow(""),
        storeIds: Joi.array().items(Joi.number()).required(),
        date: Joi.date().required(),
        vendorId: Joi.number().optional().allow(""),
        deliveryCompanyId: Joi.number().optional().allow(""),
        
    })
    return schema.validate(charge)
}


module.exports.validateSponsor = async function validateSponsor(sponsor){
    const schema = Joi.object().keys({
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
        amountEuro: Joi.number().required(),
        amountDinar: Joi.number().required(),
        note: Joi.string().required().allow(""),
        storeId: Joi.number().required(),
        //name: Joi.string().required()
    })
    return schema.validate(sponsor)
}

module.exports.isEmptyObject = async function(obj){
    let values = Object.values(obj);
    return values.some(value => value === null || value === '');
}




// module.exports.validateOwner = validateOwner;
//module.exports.validateStore = validateStore;
//module.exports.validateStoreUser = validateStoreUser;