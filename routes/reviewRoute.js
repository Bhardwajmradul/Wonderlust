const express=require("express")
const expressError=require("../expressError")
const router=express.Router()
const {isAuthenticate}=require("../middleware.js")
const reviewController=require("../controllers/reviewController.js")
const checkReview=((req,res,next)=>{
    result=reviewSchema.validate(req.query)
    if(result.error){
        throw new expressError(400,result.error)
    }
    else{
        next()
    }
})
const Listing = require('../models/listing')
const review=require("../models/review")
const {reviewSchema}=require("../reviewSchema.js")
const wrapAsync=require('../utils/wrapAsync')
router.get("/:id/:reviewId",isAuthenticate,wrapAsync(reviewController.deleteReview))
router.get("/:id",isAuthenticate,checkReview,wrapAsync(reviewController.addReview))
module.exports=router
