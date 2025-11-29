const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/Expresserror.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controller/listings.js");
//const isting = require("../models/listing");


const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Joi validator
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details.map(el => el.message).join(","));
    }
    next();
};

// HOME
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.CreateNewListing)
    );

// NEW
router.get("/new", isLoggedIn, listingController.RenderNewform);

// SHOW / UPDATE / DELETE
router.route("/:id")
    .get(wrapAsync(listingController.ShowListingByid))
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.UpdateListing)
    )
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.DeleteListing));

// EDIT PAGE
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.RenderEditform));


module.exports = router;
