const Joi = require('joi');

module.exports.validateOwner = function validateOwner(owner) {
    const schema = Joi.object({
        fullName: Joi.string().required(),
        email: Joi.string().required().email(),
        phoneNumber: Joi.string().required(),
        login: Joi.string().required().email(),
        password: Joi.string().min(6).required(),
        //accountType: Joi.string().valid('freeTrail', 'offer').required()
    });

    return schema.validate(owner);
}

module.exports.validateStore = function validateStore(store){
    const schema = Joi.object().keys({
        storeName: Joi.string().required(),
        email: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        url: Joi.string().required(),
        amount: Joi.number().required(),
        payed: Joi.number().required(),
        logo: Joi.string(),
        taxCode: Joi.string().required(),
        //ownerId: Joi.number().required(),
    });
    return schema.validate(store);
}

module.exports.validateStoreUser = function validateStoreUser(storeUser){
    const schema = Joi.object().keys({
        fullName: Joi.string().required(),
        login: Joi.string().required().email(),
        password: Joi.string().min(6).required(),
        salary: Joi.number().required().allow(""),
        permissionType: Joi.string().valid('VENDEUR', 'CHEF', 'RESPONSABLE').required(),
        storeId: Joi.number().required()
    });
    return schema.validate(storeUser);
}


module.exports.validateSubscription = function validateSubscription(subscription){
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

module.exports.validateOrder = function validateOrder(order){
    const schema = Joi.object().keys({
        clientName: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        region: Joi.string().required(),
        deliveryPrice: Joi.number().required(),
        sellPrice: Joi.number().required(),
        totalAmount: Joi.number().required(),
        //gain: Joi.number().required(),
        orderStatus: Joi.string().valid('', 'ANNULÉ', 'CONFIRMÉ','EMBALLÉ','EN ATTENTE',
        'PRÊT','EN COURS','RETOUR','RETOUR REÇU',
        'RETOUR PAYÉ','LIVRÉ','PAYÉ','CONFIRMÉ/ARTICLE NON DISPONIBLE','PAS DE RÉPONSE').required(),
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

module.exports.validateProduct = function validateProduct(product){
    const schema = Joi.object().keys({
        productReference: Joi.string().required(),
        quantityReleased: Joi.number().required(),
        stock: Joi.number().required(),
        purchaseAmount: Joi.number().required(),
        amoutSells: Joi.number().required(),
        storeIds: Joi.array().items(Joi.number()).required(),
        categoryId: Joi.number().required(),
        //sellerReference : Joi.string().required(),
        // name : Joi.string().required(),
        vendorId: Joi.number().required(),
        file: Joi.string().required(),
        references:Joi.array().items(Joi.object({reference:Joi.string().required(),quantity: Joi.number().required()})).required(),
    })
    return schema.validate(product)
}

module.exports.validateArrival = function validateArrival(arrival){
    const schema = Joi.object().keys({
        referencesQuantity: Joi.array().items(Joi.object({referenceId:Joi.number().required(),quantity: Joi.number().required()})).required(),
        buyingPrice: Joi.number().required(),
        amount: Joi.number().required(),
        facture: Joi.string().required(),
        arrivalDate: Joi.date().required(),
        productId: Joi.number().required(),
        vendorId: Joi.number().required(),
        fileId: Joi.number().required()
    })
    return schema.validate(arrival)
}


module.exports.validateVendor = function validateVendor(vendor){
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        email : Joi.string().required(),
        phoneNumber: Joi.string().required(),
        note: Joi.string().required().allow(""),
        storeIds: Joi.array().items(Joi.number()).required(),
        //file: Joi.string().required(),
    })
    return schema.validate(vendor)
}

module.exports.validateCategory = function validateCategory(category){
    const schema = Joi.object().keys({
        categoryName: Joi.string().required(),
        storeIds: Joi.array().items(Joi.number()).required()
    })
    return schema.validate(category)
}


module.exports.validateDeliveryCompany = function validateDeliveryCompany(deliveryCompany){
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        note: Joi.string().required().allow(""),
        status: Joi.string().valid('ACTIVE', 'INACTIF').required(),
        deliveryPrice: Joi.number().required(),
        retourPrice: Joi.number().required(),
        logo: Joi.string().required(),
        storeIds: Joi.array().items(Joi.number()).required()
    })
    return schema.validate(deliveryCompany)
}

module.exports.validateCharge = function validateCharge(charge){
    const schema = Joi.object().keys({
        chargeType: Joi.string().valid('PAYMENT', 'CHARGE','ACHAT').required().allow(""),
        type: Joi.string().valid('REÇU','EFFECTUÉ').optional(),
        amount: Joi.number().required(),
        note: Joi.string().required().allow(""),
        storeId: Joi.number().required(),
        date: Joi.date().required(),
        vendorId: Joi.number().optional().allow(""),
        deliveryCompanyId: Joi.number().optional().allow(""),
    })
    return schema.validate(charge)
}


module.exports.validateSponsor = function validateSponsor(sponsor){
    const schema = Joi.object().keys({
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
        amountEuro: Joi.number().required(),
        amountDinar: Joi.number().required(),
        note: Joi.string().required().allow(""),
        storeId: Joi.number().required(),
        name: Joi.string().required()
    })
    return schema.validate(sponsor)
}

module.exports.isEmptyObject =   function(obj){
    let values = Object.values(obj);
    return values.some(value => value === null || value === '');
}




// module.exports.validateOwner = validateOwner;
//module.exports.validateStore = validateStore;
//module.exports.validateStoreUser = validateStoreUser;