var express                 =       require("express"),
    router                  =       express.Router({mergeParams:true}),
    Campground              =       require("../models/campgrounds"),
    Comments                =       require("../models/comments"),
    middleware              =       require("../middleware");
//=======================
//  Comments Routes
//=======================

//New route
router.get("/new",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new",{campground:campground});
        }
    });
});

//Create Route
router.post("/",middleware.isLoggedIn,function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           req.flash("error","Something went wrong!");
           res.redirect("/campgrounds");
       } else {
        Comments.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id=req.user._id;
               comment.author.username=req.user.username;
               //save the comment
               comment.save();
               campground.comments.push(comment);
               campground.save();
               req.flash("success","Successfully added Comment!");
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
});


//Edit comment
router.get("/:comment_id/edit",middleware.checkCommnetOwnership,function(req,res){
    Campground.findById(req.params.id,function(err, foundCampground) {
       if(err|| !foundCampground){
           req.flash("error","No campground Found!");
           res.redirect("back");
       } 
       Comments.findById(req.params.comment_id,function(err, foundComment) {
           if(err){
               res.render("back");
            } else {
                res.render("comments/edit",{campground_id:req.params.id,comment:foundComment});
            } 
        });
    });
});

//Update Comment
router.put("/:comment_id",middleware.checkCommnetOwnership,function(req,res){
    Comments.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});

//Delete Route
router.delete("/:comment_id",function(req,res){
    Comments.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success","Comment Deleted!")
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});


module.exports=router;