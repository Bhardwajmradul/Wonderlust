const mongoose = require('mongoose');
const Listing = require("../models/listing.js");
const Users=require("../models/user.js");
const {data} = require("../init/data.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken="pk.eyJ1IjoiZGVsdGEtc3R1ZHVlbnQiLCJhIjoiY2xvMDk0MTVhMTJ3ZDJrcGR5ZDFkaHl4ciJ9.Gj2VU1wvxc7rFVt5E4KLOQ"
const geocodingClient = mbxGeocoding({ accessToken:mapToken });
main()
.then((res) =>{
    console.log("connection made");
})
.catch((err)=> {
    console.log(err);
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}
let defaultUser={
    username:"Mradul",
    email:"mradul.bhardwaj@gmail.com"
}
let defaultUserId;
let initUsers=async()=>{
    await Users.deleteMany({});
    console.log("All users deleted")
    let user=new Users(defaultUser)
    await user.save().then((res)=>{
        defaultUserId=res.id
        console.log("Default user added");
    }).catch((err)=>{
        console.log("err");
    })
}
async function addMany(listings){
    listings=await Promise.all (listings.map(async(listing)=>{
        coordinates=await geocodingClient.forwardGeocode({
            query: `${listing.location}, ${listing.country}`,
            limit: 1
          }).send() 
        longitude=coordinates.body.features[0].geometry.coordinates[0]
        latitude=coordinates.body.features[0].geometry.coordinates[1]
        if (!listing.geometry) {
            listing.geometry = {};
            if (!listing.geometry.coordinates) {
                listing.geometry.coordinates = [];
            }
        }
        listing.geometry.type="Point"
        listing.geometry.coordinates[0]=longitude
        listing.geometry.coordinates[1]=latitude
        listing.owner=defaultUserId;
        // console.log(`ownerId is this- ${listing.filter}`)
        // console.log(`ownerId is this- ${defaultUserId}`)
        return listing
    }))
    await Listing.insertMany(listings).then((res) => {
        console.log(res)
    }).catch((err) => {
        console.log(err);
    });

}
async function deleteAll(){
    await Listing.deleteMany().then((res)=>{
        console.log("All records deleted")
    }).catch((err)=>{
        console.log("there was some error")
    })
}
async function initDB(data){
    await deleteAll();
    await initUsers();
    await addMany(data)
    await Listing.find().then((res)=>{
        console.log(res)
    })
}
initDB(data);
// console.log(data)

