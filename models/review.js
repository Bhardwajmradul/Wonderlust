const mongoose=require("mongoose")
const schema=mongoose.Schema
const reviewSchema=schema({
    rating:{
        type:Number,
        min:1,
        max:5
    },
    comment:{
        type:String,
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    }
})

module.exports=mongoose.model("review",reviewSchema)