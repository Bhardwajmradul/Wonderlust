const Listing = require('../models/listing')
const {init,find,add,update,del}=require("../init/index")
const {cloudinary}=require("../cloudinary.js")
module.exports.showAllListings=async (req,res)=>{
    const allListing=await Listing.find({})
    res.render("listings/index.ejs",{allListing})
}

module.exports.addListing=async (req,res)=>{
    // result=schema.validate(req.body)
    let url=req.file.path
    let filename=req.file.filename
    const listing=req.body.listing
    listing.ownerId=req.user.id
    listing.image={url,filename}
    data=new Listing(listing)
    await add(data)
    req.flash("success","New listing is created")
    res.redirect("http://localhost:8080/listing",)
}
module.exports.showSingalListingById=async (req,res)=>{
    let {id}=req.params
    const listing = await Listing.findById(id)
    .populate({path:"reviews",populate:{path:"user"}})
    if(!listing){
        req.flash("error","The listing you are looking for was deleted")
        res.redirect('/listing')
    }
    else{
        res.render("listings/listing.ejs",{listing})
    }
}
module.exports.updateListing=async(req,res)=>{
    let {id}=req.params
    let {title,description,price,location,country}=req.body
    let listing=await Listing.findById(id).populate("ownerId")
    if(req.file){
        console.log(`/${listing.image.filename}`)
        cloudinary.uploader.destroy(`${listing.image.filename}`)
        url=await req.file.path
        filename=await req.file.filename
    }
    else{
        url=listing.image.url
        filename=listing.image.filename
    }
    image={url,filename}
    let data={title,description,price,location,country,image}
    await update(data,id)
    req.flash("success",`${title} is updated successfully`)
    res.redirect("http://localhost:8080/listing")   
}
module.exports.updateListingForm=async(req,res)=>{
    let {id}=req.params
    let data=await Listing.findById(id).populate("ownerId")
    if(data.ownerId.id==req.user.id){
        let url=data.image.url
        url=url.replace("/upload",'/upload/h_300/w_250')
        console.log(url)
        res.render("listings/update.ejs",{data,url})}
    else{
        req.flash("error",`You are "${req.user.username}" but this listing belongs to "${data.ownerId.username}", so can't update`)
        res.redirect(`/listing/${id}`)
    }
}
module.exports.deleteListing=async(req,res)=>{
    let {id}=req.params
    let listing=await Listing.findById(id).populate("ownerId")
    if(listing.ownerId.id==req.user.id){
        await Listing.findByIdAndDelete(id)
        req.flash("success","Listing deletion successfull")
        res.redirect("http://localhost:8080/listing")
    }
    else{
        req.flash("error",`You are "${req.user.username}" but this listing is owned by "${listing.ownerId.username}"`)
        res.redirect(`http://localhost:8080/listing/${id}`)
    }
}