const auth = require("express").Router();
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const jwt = require("jsonwebtoken");
const { SECRET } = require("../util/constants");
const path = require("path");
const root = require("../util/root");
require('dotenv').config(path.join(root, ".env"));

const GOOGLE_CLIENT_ID = process.env.CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET;

module.exports = (passport) => {
  passport.use(new GoogleStrategy({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    return done(null, user);
  });

  auth.get('/login', passport.authenticate('google', { scope : ['profile', 'email'] }));
  
  auth.get('/google/callback', 
    passport.authenticate('google', {
      failureRedirect: '/error',
      successRedirect: '/'
    })
  );

  auth.get('/getAccessToken', (req, res, next) => {
    if (req.user) {
      const token = jwt.sign(
        {
          user: req.user
        },
        SECRET,
        {
          expiresIn: "12h",
        }
      );
      
      res.json({ token: token })
    }
    else{
      res.json({ token: null })
    }
  });

  auth.use("/logout", (req, res, next) => {
    req.session = null;
    req.logOut();
    res.redirect("/");
  });
  

  return auth;
}