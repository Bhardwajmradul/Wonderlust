const Listing = require('../models/listing')
const review=require("../models/review")
module.exports.deleteReview=async(req,res)=>{
    let {id,reviewId}=req.params
    let listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"user"}})
    console.log(listing.reviews[0].id)
    console.log(reviewId)
    listing=await Listing.findOne({"_id":id}).populate({path:"reviews",populate:{path:"user"}})
    for(i of listing.reviews){
        if(i.id==reviewId){
            if(i.user.id==req.user.id){
                await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
                await review.findByIdAndDelete(reviewId)
                req.flash("success",`Review by "${req.user.username}" is deleted`)
                res.redirect(`/listing/${id}`)
            }
            else{
                req.flash("error",`You are "${req.user.username}" but the review is by "${i.user.username}". So can't delete`)
                res.redirect(`/listing/${id}`)
            }
        }
    }
}
module.exports.addReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id)
    let userId=req.user.id
    let newReview=req.query.review
    newReview.user=userId
    newReview=new review(req.query.review)
    listing.reviews.push(newReview)
    await listing.save()
    newReview.save()
    req.flash("success","Review added successfully")
    res.redirect(`/listing/${listing.id}`)

}