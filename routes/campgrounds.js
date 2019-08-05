var express                 =       require("express"),
    router                  =       express.Router(),
    Campground              =       require("../models/campgrounds"),
    middleware              =       require("../middleware");
//INDEX ROUTE
router.get("/",function(req,res){
    Campground.find({},function(err,allCampgrounds){
    if(err){
       console.log(err);
    }
    else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds});
    }
});

});

//CREATE ROUTE
router.post("/",middleware.isLoggedIn,function(req,res){
   var name = req.body.name;
   var price=req.body.price;
   var image =req.body.image;
   var desc =req.body.description;
   var author={
       id:req.user._id,
       username:req.user.username
   };
   var newCampground={name: name, image: image, description:desc, author:author};
   
   //Create campground and add to DB
   Campground.create(newCampground,function(err,newlyCreated){
       if(err){
           console.log(err);
       }
       else{
           console.log(newlyCreated);
           res.redirect("/campgrounds");
       }
   });

   
});

//NEW ROUTE
router.get("/new",middleware.isLoggedIn,function(req, res) {
   res.render("campgrounds/new"); 
});

//SHOW ROUTE
router.get("/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampgrounds){
        if(err || !foundCampgrounds){
            req.flash("error","Campground not Found!");
            res.redirect("back");
        }
        else{
            console.log(foundCampgrounds);
            res.render("campgrounds/show",{campground:foundCampgrounds});
        }
    });
    
});

//Edit Campground
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req, res) {
    Campground.findById(req.params.id,function(err,foundCampground){
        res.render("campgrounds/edit",{campground:foundCampground});
    });
});



//Update Campground
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" +req.params.id);
        }
    });
});

//Delete route
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});





module.exports=router;
