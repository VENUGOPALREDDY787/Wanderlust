const express = require('express');
const router = express.Router({mergeParams:true});
const warpAsync = require('../utils/warpAsync.js');
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressErrors = require("../utils/ExpressErrors.js");
const {reviewSchema} = require("../schema.js");
const {validateReview, isLoggedIn, isAuthor} = require("../middleware.js")
const {createReview} = require("../controllers/reviews.js");
const { deleteListing } = require('../controllers/listings.js');

 



//reviews
//post
router.post("/", isLoggedIn,validateReview,warpAsync(createReview));

// delete
router.delete("/:reviewId",isLoggedIn, isAuthor,warpAsync(deleteListing));

module.exports = router;
