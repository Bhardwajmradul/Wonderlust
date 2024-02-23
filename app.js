if(process.env.NODE_ENV!="production"){
    require('dotenv').config()
}
const mongoose=require('mongoose')
const dburl=process.env.url
async function main(){
    await mongoose.connect(dburl)
}
const express= require('express')
const listings=require("./routes/listingRoute.js")
const engine = require('ejs-mate')
const expressError=require("./expressError")
const app=express()
const cookieParser=require("cookie-parser")
const port =8080
const path= require('path')
const Listing = require('./models/listing')
const review=require("./models/review")
const {reviewSchema}=require("./reviewSchema.js")
const wrapAsync=require('./utils/wrapAsync')
const reviewRoute=require("./routes/reviewRoute.js")
const {schema}=require('./schema.js')
const flash=require("connect-flash")
const session=require("express-session")
const MongoStore=require("connect-mongo")
const passport=require("passport")
const LocalStrategy=require("passport-local")
const user=require("./models/user.js")
const userRouter=require("./routes/userRoute.js")
const store=MongoStore.create({
    mongoUrl: dburl,
    crypto:{
        secret:process.env.secret
    },
    touchAfter: 24*3600,
})
store.on("error",()=>{
    console.log("There is some shitty error in the fucking code in the session store part")
})
const sessionOpt={
    store,
    secret:process.env.secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*60*60*1000,
    }
} 
app.use(session(sessionOpt))
app.use(flash())
app.use(passport.initialize())                          // to initalize passport
app.use(passport.session())                             // to give passport the ability to create sessions
passport.use(new LocalStrategy(user.authenticate()))    // .authenticate is a function used to authenticate a user
passport.serializeUser(user.serializeUser());           // it is used to store data of the user in the sessions
passport.deserializeUser(user.deserializeUser());       // it is used to remove the data of the user from the sessions
app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success")
    res.locals.errorMsg=req.flash("error")
    res.locals.user=req.user
    next()
})
app.engine('ejs', engine);
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.set('views',path.join(__dirname,'/views'))
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,'/public')))
app.use((req,res,next)=>{
    req.time=new Date(Date.now())
    console.log(req.method,req.hostname,req.time)
    return next()
})
app.use("/listing",listings)
app.use("/user",userRouter)
app.listen(port,()=>{
    console.log(port)
})

main().then((res)=>{
    console.log("connection secured")
}).catch((err)=>{
    // console.log("There's some shit in the fucking code")
    console.log(err)
})
app.get("/",(req,res)=>{
    res.cookie("project","wonderlust")
    res.send("Port is active")
})
app.get("/err",(req,res)=>{
    abc=abc
})
app.get("/admin",(req,res)=>{
    throw new expressError(403,"not allowed")
})
// app.use('*',(req,res,err)=>{
//     throw new expressError(402,"Page not found")
// })
app.use((err,req,res,next)=>{
    console.log(err)
    let{status=500,message}=err
    res.status(status).render("errors/error.ejs",{message})
})
app.use((req,res)=>{
    res.status(404).send("Page not found")
})

