const mongoose=require('mongoose')
const Listing=require("../models/listing")
const review=require("../models/review")
const user=require("../models/user")
const data=require("./data")
const { de } = require('@faker-js/faker')
const dburl=process.env.url
async function main(){
    await mongoose.connect(dburl)
}
main().then((res)=>{
    console.log("connected with database")
}).catch((err)=>{
    console.log("ther was some error")
})
async function find(){
    await Listing.find().populate("ownerId").then((res)=>{
        console.log(res)
    }).catch((err)=>{
        console.log("There was some error")
    })
}
async function deleteAll(){
    await Listing.deleteMany().then((res)=>{
        console.log("All records deleted")
    }).catch((err)=>{
        console.log("there was some error")
    })
    // await review.deleteMany().then((res)=>{
    //     console.log("All review data deleted")
    // }).catch((err)=>{
    //     console.log("there was some error")
    // })
    // await user.deleteMany().then((res)=>{
    //     console.log("All user data deleted")
    // }).catch((err)=>{
    //     console.log("there was some error")
    // })
}
async function add(data){
    let add= new Listing(data)
    await add.save().then((res)=>{
        console.log(res)
    }).catch((err)=>{
        console.log(err)
    })
}
async function addMany(listings) {
    listings=await listings.map((listing)=>{
        listing.ownerId="65d82e2e0613e7ad7e1d2f9d"
        return listing
    })
    await Listing.insertMany(listings).then((res) => {
        console.log("All records added");
    }).catch((err) => {
        console.log('There was some error');
    });
}
async function init(){
    await deleteAll()
    await addMany(data.data)
}
async function update(data,ID){
    Listing.findById(ID).then(async(res)=>{

        res.title=data.title
        res.description=data.description
        res.image=data.image
        res.price=data.price
        res.location=data.location
        res.country=data.country
        console.log(await res.save())

    }).catch((err)=>{
        console.log(err)
    })

}
async function del(ID){
    Listing.findByIdAndDelete(ID).then(async(res)=>{
        console.log(res)
    }).catch((err)=>{
        console.log(err)
    })
}

// for(let i of data){
//     add(i)
// }
module.exports={init,find,add,update,del}