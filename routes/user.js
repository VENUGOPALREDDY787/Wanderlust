const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const warpAsync = require("../utils/warpAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../authMiddleware.js");
const {
  signupform,
  NewUser,
  loginform,
  NewUserLogin,
  LogoutRoute,
} = require("../controllers/users.js");

router.route("/signup").get(signupform).post(warpAsync(NewUser));

router
  .route("/login")
  .get(loginform)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    warpAsync(NewUserLogin)
  );

router.get("/logout", LogoutRoute);

module.exports = router;
