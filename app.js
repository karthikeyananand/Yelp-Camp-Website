

var express                 =       require("express"),
    app                     =       express(),
    bodyParser              =       require("body-parser"),
    mongoose                =       require("mongoose"),
    flash                   =       require("connect-flash"),
    passport                =       require("passport"),
    LocalStrategy           =       require("passport-local"),
    methodOverride          =       require("method-override"),
    passportLocalMongoose   =       require("passport-local-mongoose"),
    Campground              =       require("./models/campgrounds.js"),
    Comments                =       require("./models/comments"),
    seedDB                  =       require("./seeds"),
    User                    =       require("./models/user");
    
//requiring routes
var commentRoutes           =       require("./routes/comments"),
    campgroundRoutes        =       require("./routes/campgrounds"),
    indexRoutes             =       require("./routes/index");
    
var url=process.env.DATABASEURL||"mongodb://localhost:27017/yelp_camp_v9";
mongoose.connect(url,{ useNewUrlParser: true, useCreateIndex:true });

app.use(bodyParser.urlencoded({extended:true}));
mongoose.set('useFindAndModify', false);
app.set("view engine","ejs");
mongoose.set('useCreateIndex', true);
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //Seed Database


//Passport configuration
app.use(require("express-session")({
    secret:"This is depressing",
    resave:false,
    saveUninitialized:false
}));
app.locals.moment = require('moment');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});

app.use("/",indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("YelpCamp server has started!!");
});