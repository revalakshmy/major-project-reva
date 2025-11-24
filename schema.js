const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),

        pincode: Joi.alternatives()
            .try(
                Joi.string().length(6),
                Joi.number().integer().min(100000).max(999999)
            )
            .required(),

        lat: Joi.number().optional(),
        lng: Joi.number().optional(),
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});
