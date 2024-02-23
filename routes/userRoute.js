const express=require('express')
const router=express.Router()
const wrapAsync=require('../utils/wrapAsync')
const user=require("../models/user.js")
const passport=require("passport")
const {savedRedirectUrl}=require("../middleware.js")
const userController=require("../controllers/userController.js")
router.get('/signup',(req,res)=>{
    res.render("users/user.ejs")
})
router.post('/signup', wrapAsync(userController.userSignup));
router.get('/login',(req,res)=>{
    res.render('users/login.ejs')
})
router.post("/login",savedRedirectUrl,passport.authenticate("local",{failureRedirect:"/user/login",failureFlash:true}),wrapAsync(userController.userLogin))
router.get("/logout",(req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","You are logged out successfully")
        res.redirect("/listing")
    })
})
module.exports=router