if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressErrors = require("./utils/ExpressErrors");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const LocalStrategy = require("passport-local");

const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");
const User = require("./models/user");

const MONGO_URL = process.env.mongoAtlas;

// ---------- APP CONFIG ----------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ---------- SESSION ----------
const sessionOptions = {
  secret: process.env.SCEREAT,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

// ---------- START SERVER ----------
async function startServer() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ MongoDB Connected");

    app.use(session(sessionOptions));
    app.use(flash());

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    app.use((req, res, next) => {
      res.locals.success = req.flash("success");
      res.locals.error = req.flash("error");
      res.locals.currUser = req.user;
      next();
    });

    app.use("/listings", listingRouter);
    app.use("/listings/:id/reviews", reviewRouter);
    app.use("/", userRouter);

    app.use((req, res, next) => {
  next(new ExpressErrors(404, "Page Not Found"));
});


    app.use((err, req, res, next) => {
      const { statusCode = 500, message = "Something Went Wrong" } = err;
      res.status(statusCode).render("error.ejs", { message });
    });

    app.listen(8080, () => {
      console.log("🚀 Server running on port 8080");
    });

  } catch (err) {
    console.error("❌ Startup failed:", err);
  }
}

startServer();
