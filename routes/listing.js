const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/Expresserror.js");
const { listingSchema } = require("../schema.js");
const listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controller/listings.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Joi Validation Middleware for listings
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

// ===========================================================
// HOME PAGE (Index) — SHOW AI BUTTON ONLY ON THIS ROUTE
// ===========================================================

router
    .route("/")
    .get(wrapAsync(listingController.index))   // index now returns { showAI: true }
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.CreateNewListing)
    );

// ===========================================================
// NEW LISTING FORM — AI HIDDEN
// ===========================================================
router.get("/new", isLoggedIn, listingController.RenderNewform);

// ===========================================================
// SHOW, UPDATE, DELETE — AI HIDDEN
// ===========================================================

router
    .route("/:id")
    .get(wrapAsync(listingController.ShowListingByid))
    .put(
        validateListing,
        isOwner,
        upload.single("listing[image]"),
        wrapAsync(listingController.UpdateListing)
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.DeleteListing)
    );

// ===========================================================
// EDIT PAGE — AI HIDDEN
// ===========================================================
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.RenderEditform));

module.exports = router;
