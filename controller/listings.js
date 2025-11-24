const Listing = require("../models/listing");
const axios = require("axios");

// ⭐ Clean address for proper geocoding
function cleanAddress(str) {
    // Removes wrong commas like "place,Delhi" → "place, Delhi"
    return str.replace(/\s*,\s*/g, ", ");
}

// ====================== INDEX PAGE ======================
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {
        allListings,
        showAI: true,
    });
};

// ====================== NEW FORM =======================
module.exports.RenderNewform = (req, res) => {
    res.render("listings/new.ejs", { showAI: false });
};

// ====================== CREATE LISTING ==================
module.exports.CreateNewListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    // ⭐ Prepare full address
    const rawAddr = `${newListing.location}, ${newListing.pincode}, ${newListing.country}`;
    const fullAddress = cleanAddress(rawAddr);

    // ⭐ Geocoding (OpenStreetMap)
    const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`;
    const geoRes = await axios.get(geoUrl);

    if (geoRes.data.length > 0) {
        newListing.lat = parseFloat(geoRes.data[0].lat);
        newListing.lng = parseFloat(geoRes.data[0].lon);
    }

    await newListing.save();
    req.flash("success", "New listing created successfully!");
    res.redirect("/listings");
};

// ========================= SHOW LISTING =========================
module.exports.ShowListingByid = async (req, res) => {
    const { id } = req.params;
    const foundlisting = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" },
        })
        .populate("owner");

    if (!foundlisting) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", {
        listing: foundlisting,
        showAI: false,
    });
};

// ========================= EDIT FORM ==========================
module.exports.RenderEditform = async (req, res) => {
    const foundlisting = await Listing.findById(req.params.id);

    if (!foundlisting) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", {
        listing: foundlisting,
        showAI: false,
    });
};

// ========================= UPDATE LISTING =====================
module.exports.UpdateListing = async (req, res) => {
    const { id } = req.params;

    const foundlisting = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        { new: true }
    );

    // Update Image if new file uploaded
    if (req.file) {
        foundlisting.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
    }

    // ⭐ Full address cleaning
    const rawAddr = `${foundlisting.location}, ${foundlisting.pincode}, ${foundlisting.country}`;
    const fullAddress = cleanAddress(rawAddr);

    // ⭐ Geocode again on update
    const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`;
    const geoRes = await axios.get(geoUrl);

    if (geoRes.data.length > 0) {
        foundlisting.lat = parseFloat(geoRes.data[0].lat);
        foundlisting.lng = parseFloat(geoRes.data[0].lon);
    }

    await foundlisting.save();

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};

// ======================== DELETE LISTING ======================
module.exports.DeleteListing = async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
};
