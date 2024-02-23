const mongoose=require("mongoose")
const reviewSchema=require("./review")
const review = require("./review")
const user = require("./user")
const listingSchema=new mongoose.Schema({
    title:{
        type:String,
    },
    description:String,
    image:
    {
        filename:{
            type:String,
            default:"image",
            set:(v)=>
                v===""
                ?"image"
                :v
            }
        ,
        url:{
            type:String,
            default:"https://oyster.ignimgs.com/mediawiki/apis.ign.com/game-of-thrones/d/d9/Dragonstone_castle.jpg",
            set:(v)=>
                v===""
                ?"https://oyster.ignimgs.com/mediawiki/apis.ign.com/game-of-thrones/d/d9/Dragonstone_castle.jpg"
                :v
            }
    }
    ,
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:mongoose.Schema.ObjectId,
            ref:reviewSchema
        }
    ],
    ownerId:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    }
})
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        console.log(listing)
        await review.deleteMany({_id:{$in:listing.reviews}})
    }
})
const Listing= mongoose.model("Listing",listingSchema)
module.exports=Listing