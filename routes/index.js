var express                 =       require("express"),
    router                  =       express.Router(),
    passport                =       require("passport"),
    User                    =       require("../models/user");

//SCHEMA SETUP
router.get("/",function(req,res){
    res.render("landing");
});


//Auth Routes
// show register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    if(req.body.adminCode==="secretcode123"){
        newUser.isAdmin=true;
    }
    User.register(newUser, req.body.password, function(err, user){
    if(err){
        console.log(err);
        return res.render("register", {error: err.message});
    }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to YelpCamp " + user.username);
           res.redirect("/campgrounds"); 
        });
    });
});



//Show login page
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});

router.post("/login",passport.authenticate("local",
    {
        successRedirect:"/campgrounds",
        failureRedirect:"/login"
    }),function(req, res) {
});

//logout route
router.get("/logout",function(req, res) {
    req.logout();
    req.flash("success","Logged You Out!");
    res.redirect("/campgrounds");
});


module.exports=router;