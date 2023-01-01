const Joi = require('joi');

function validateOwner(Owner) {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phoneNumber: Joi.string().required(),
        login: Joi.string().required(),
        password: Joi.string().required(),
        accountType: Joi.string().valid('freeTrail', 'offer').required(),
    });

    return schema.validate(Owner);
}

function validateStore(Store){
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        amount: Joi.number().required(),
        payed: Joi.number().required(),
        logo: Joi.string(),
        taxCode: Joi.string().required(),
        ownerId: Joi.number().required(),
    });
    return schema.validate(Store);
}

function validateUser(User){
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        login: Joi.string().required(),
        password: Joi.string().required(),
        salary: Joi.number().optional().allow(""||null),
        storeId: Joi.number().required()
    });
    return schema.validate(User);
}



module.exports.validateOwner = validateOwner;
module.exports.validateStore = validateStore;
module.exports.validateUser = validateUser;