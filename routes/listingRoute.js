const express=require("express")
const router=express.Router()
const expressError=require("../expressError")
const wrapAsync=require('../utils/wrapAsync')
const Listing = require('../models/listing')
const reviewRoute=require("./reviewRoute.js")
const {schema}=require('../schema.js')
const {init,find,add,update,del}=require("../init/index")
const passport=require("passport")
const {isAuthenticate}=require("../middleware.js")
const ListingController=require("../controllers/listingController.js")
const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })
const {storage}=require("../cloudinary.js")
const upload = multer({ storage })

const checkSchema=((req,res,next)=>{
    result=schema.validate(req.body)
    if(result.error){
        throw new expressError(400,result.error)
        req.flash("error","New listing wasn't added")
    }
    else{
        req.flash("success","New listing addition successfull")
        next()
    }
})

// show all listing
router.get("/",wrapAsync(ListingController.showAllListings))
// create a new listing
router.get("/newListing",isAuthenticate,(req,res)=>{
    res.render("listings/new.ejs")
})
router.post("/addListing",upload.single("listing[image][url]"),checkSchema,isAuthenticate,wrapAsync(ListingController.addListing))
// see a listing by id
router.get("/:id",wrapAsync(ListingController.showSingalListingById))
// update a listing 
router.post("/update/:id",upload.single("listing[image][url]"),isAuthenticate,wrapAsync(ListingController.updateListing))
router.get("/update/:id",isAuthenticate,wrapAsync(ListingController.updateListingForm))
// delete a listing
router.get("/delete/:id",isAuthenticate,wrapAsync(ListingController.deleteListing))
// for review routes
router.use("/review",reviewRoute)
module.exports=router