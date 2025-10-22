const Listing = require("./models/listing.js")
const Review = require("./models/review.js")

const {listingSchema,reviewSchema} = require("./schema.js");
const ExpressErrors = require("./utils/ExpressErrors.js");

module.exports.isLoggedIn = (req, res, next)=>{
if(!req.isAuthenticated()){
  req.session.redirectUrl = req.originalUrl;
    req.flash("error","you Must be logged in to create listing!");
    return res.redirect("/login");
  }
    next();

}
module.exports.saveRedirectUrl =( req,res,next)=>{
if(req.session.redirectUrl){
  res.locals.redirectUrl = req.session.redirectUrl;
}
next();
}

module.exports.isOwner = async(req, res, next)=>{
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","You dont have the access to edit this listing");
    return res.redirect(`/listings/${id}`);
  }
  next()
}
module.exports.validateListing = (req, res, next) =>{
  let {error} = listingSchema.validate(req.body);
  if(error){
  throw new ExpressErrors(400,error);
  }
  else{
    next();
  }
};


module.exports.validateReview = (req, res, next) =>{
  let {error} = reviewSchema.validate(req.body);
  if(error){
  throw new ExpressErrors(400,error);
  }
  else{
    next();
  }
}

module.exports.isAuthor = async(req, res, next)=>{
  let {id , reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author._id.equals(res.locals.currUser._id)){
    req.flash("error","You dont access to delete");
    return res.redirect(`/listings/${id}`);
  }
  next()
}