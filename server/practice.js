const express=require("express")
const app=express()
const cookieParser=require("cookie-parser")
const port=3000
const session=require("express-session")
const flash=require("connect-flash")
app.use(cookieParser("shyama"))
app.use(flash())
app.use(session({secret:"mysecretcode",resave:false,saveUninitialized:true,}))
app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success")
    res.locals.errorMsg=req.flash("error")
    next()
})
app.listen(port,()=>{
    console.log("port is up running")
})
app.get("/",(req,res)=>{
    let {name="annonymus"}=req.query
    req.session.name=name
    if(name==="annonymus"){
        req.flash("error","user not registered")
    }
    else{
        req.flash("success","user registered successfully")}
    res.redirect("/hello")
})
app.get('/hello',(req,res)=>{
    res.render("page.ejs",{name:req.session.name,msg:req.flash("success")})
})