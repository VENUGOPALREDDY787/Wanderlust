const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async(req, res)=>{
  const {id} = req.params;
const newReview = new Review(req.body.review);
  const listing =await Listing.findById(id);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  console.log("new review saved ");
  req.flash("success","New Review Created");
  res.redirect(`/listings/${id}`);
}

module.exports.deleteReview = async (req,res)=>{
let {id ,reviewId} = req.params;
  await Listing.findByIdAndUpdate(id, {$pull:{reviews: reviewId}});
 await Review.findByIdAndDelete(reviewId);
   req.flash("success","review Deleted");

 res.redirect(`/listings/${id}`);
}