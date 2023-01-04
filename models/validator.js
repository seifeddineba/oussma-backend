const Joi = require('joi');

function validateOwner(Owner) {
    const schema = Joi.object({
        fullName: Joi.string().required(),
        email: Joi.string().email().required(),
        phoneNumber: Joi.string().required(),
        login: Joi.string().required(),
        password: Joi.string().required(),
        //accountType: Joi.string().valid('freeTrail', 'offer').required()
    });

    return schema.validate(Owner);
}

function validateStore(Store){
    const schema = Joi.object().keys({
        storeName: Joi.string().required(),
        amount: Joi.number().required(),
        payed: Joi.number().required(),
        logo: Joi.string(),
        taxCode: Joi.string().required(),
        //ownerId: Joi.number().required(),
    });
    return schema.validate(Store);
}

function validateStoreUser(StoreUser){
    const schema = Joi.object().keys({
        fullName: Joi.string().required(),
        login: Joi.string().required(),
        password: Joi.string().required(),
        salary: Joi.number().optional().allow(""),
        permissionType: Joi.string().valid('SELLER', 'CHIEF', 'RESPONSABLE').required(),
        storeId: Joi.number().required()
    });
    return schema.validate(StoreUser);
}


function validateSubscription(){
    const schema = Joi.object().keys({

    })
    return schema.validate()
}


module.exports.validateOwner = validateOwner;
module.exports.validateStore = validateStore;
module.exports.validateStoreUser = validateStoreUser;