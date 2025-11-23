const listing = require("../models/listing");

// HOME PAGE — SHOW AI BUTTON ONLY HERE
module.exports.index = async (req, res) => {
    const allListings = await listing.find({});
    res.render("listings/index.ejs", { 
        allListings,
        showAI: true   // <-- AI button appears ONLY on home page
    });
};

module.exports.RenderNewform = (req, res) => {
    res.render("listings/new.ejs", { showAI: false });
};

module.exports.ShowListingByid = async (req, res) => {
    let { id } = req.params;
    const foundlisting = await listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" },
        })
        .populate("owner");

    if (!foundlisting) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { 
        listing: foundlisting, 
        showAI: false 
    });
};

module.exports.CreateNewListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    await newListing.save();

    req.flash("success", "new listing saved successfully!");
    res.redirect("/listings");
};

module.exports.RenderEditform = async (req, res) => {
    let { id } = req.params;
    const foundlisting = await listing.findById(id);

    if (!foundlisting) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { 
        listing: foundlisting,
        showAI: false 
    });
};

module.exports.UpdateListing = async (req, res) => {
    let { id } = req.params;

    const foundlisting = await listing.findByIdAndUpdate(
        id, 
        { ...req.body.listing }
    );

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        foundlisting.image = { url, filename };
        await foundlisting.save();
    }

    req.flash("success", "listing updated successfully!");
    res.redirect(`/listings/${id}`);
};

module.exports.DeleteListing = async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", " listing deleted successfully!");
    res.redirect("/listings");
};
