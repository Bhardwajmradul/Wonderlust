const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner,schemaValidation } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


//create route
router.route("/new")
.get( isLoggedIn,listingController.renderNewForm)
.post( isLoggedIn,upload.single('listing[image][url]'),schemaValidation,wrapAsync(listingController.createListing))


//index route
router.get("/",wrapAsync(listingController.index));


//edit route
router.get("/:id/edit", isLoggedIn, isOwner,  wrapAsync(listingController.renderEditForm))

router.post("/update/:id", isLoggedIn, isOwner, upload.single('listing[image][url]'), schemaValidation ,wrapAsync(listingController.updateListing))


//delete route
router.get("/:id/delete", isLoggedIn,isOwner, wrapAsync(listingController.destroyListing))


//show route
router.get("/:id",wrapAsync(listingController.showListing));
router.get("/filter/:filter",wrapAsync(async(req,res)=>{
    let {filter}=req.params
    let allListings = await Listing.find({});
    allListings=allListings.filter(doc => doc.filter.includes(filter));
    res.render("./listings/index.ejs",{allListings});
}))
router.post("/search",wrapAsync(async(req,res)=>{
    let country=req.body.find.country
    let allListings=await Listing.find();
    allListings=allListings.filter(listing=>listing.country==country);
    res.render("./listings/index.ejs",{allListings});
}))

module.exports = router;
