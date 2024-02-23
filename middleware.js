module.exports.isAuthenticate=((req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl
        req.session.user=req.user
        req.flash("error","You need to login first")
        return res.redirect('/user/login')
    }
    else{
        return next()
    }
})
module.exports.savedRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl  
    }
    next()
}
module.exports.user=(req,res,next)=>{
    res.locals.user=req.session.user
    next()
}