const express = require("express");
const router = express.Router();
const warpAsync = require("../utils/warpAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const {
  index,
  New,
  show,
  create,
  edit,
  update,
  deleteListing,
} = require("../controllers/listings.js");
const multer = require("multer")
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});




router
  .route("/")
  .get(warpAsync(index))
  .post(isLoggedIn,upload.single('listing[image]'), validateListing ,warpAsync(create));
router.get("/new", isLoggedIn, New);
router
  .route("/:id")
  .get(warpAsync(show))
  .put(isLoggedIn, isOwner, upload.single('listing[image]'),validateListing, warpAsync(update))
  .delete(isLoggedIn, isOwner, warpAsync(deleteListing));

router.get("/:id/edit", isLoggedIn, isOwner, warpAsync(edit));

module.exports = router;
