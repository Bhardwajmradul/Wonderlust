const user=require("../models/user.js")
module.exports.userSignup=async (req, res, next) => {
    let { username, email, password } = req.body.user;
    let newUser = new user({
        username: username,
        email: email
    });
    try {
        const userRegistered = await user.register(newUser, password);
        req.login(userRegistered, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to WonderLust!!");
            res.redirect('/listing');
        });

    } catch (err) {
        console.error(err);
        req.flash("error", "Error during registration. Please try again.");
        res.redirect('/user/signup');
    }
}
module.exports.userLogin=async(req,res)=>{
    req.flash("success",`Welcome back ${req.body.username} `)
    let redirecturl=res.locals.redirectUrl || "/listing"
    res.redirect(redirecturl)
}