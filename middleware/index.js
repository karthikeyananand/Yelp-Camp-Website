var middlewareObj={},
    Campground              =       require("../models/campgrounds"),
    Comments                =       require("../models/comments");

middlewareObj.checkCampgroundOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err || !foundCampground){
                req.flash("error","Campground not found!");
                res.redirect("back");
            } else {
                if(foundCampground.author.id.equals(req.user._id) || req.body.isAdmin){
                    next();
                } else {
                    req.flash("error","You do have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error","You need to be logged in!");
        res.redirect("back");
    }
    
};

middlewareObj.checkCommnetOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        Comments.findById(req.params.comment_id,function(err,foundComment){
            if(err || !foundComment){
                req.flash("error","Comment not found");
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)|| req.body.isAdmin){
                    next();
                } else {
                    req.flash("error","You do have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        res.flash("error","You need to be logged in!");
        res.redirect("back");
    }
    
};

middlewareObj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please Login First!");
    res.redirect("/login");
};


  


module.exports=middlewareObj;
