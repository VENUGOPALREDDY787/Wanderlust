  const User =require("../models/user.js");


module.exports.signupform = (req, res)=>{
 res.render("users/signup.ejs");
}

module.exports.NewUser = async(req,res)=>{
    try{
    let {username, email,password} = req.body;
    const newuser = new User ({email, username})
    let registeredUser = await User.register(newuser,password);
    req.login(registeredUser,(err)=>{
       if(err){
        return next (err);
       } 
        req.flash("success","Welcome to Wanderlust ");
        res.redirect("/listings");
    })
   
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup")
    }
}

module.exports.loginform = (req, res) => {
 res.render("users/login.ejs");
}

module.exports.NewUserLogin = async(req, res) =>{
req.flash("success","Welcome back to Wanderlust");
if(!res.locals.redirectUrl){
    return res.redirect("/listings")
}
res.redirect(res.locals.redirectUrl);
}

module.exports.LogoutRoute = (req, res, next)=>{
 req.logOut((err)=>{
    if(err){
        return next(err);
    }
    req.flash("success","you are logged out!");
    res.redirect("/listings");
 });
}

