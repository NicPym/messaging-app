const auth = require("express").Router();
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const jwt = require("jsonwebtoken");
const { SECRET } = require("../util/constants");
const path = require("path");
const root = require("../util/root");
const db = require("../models");
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
      const user = {
        name: profile.name.givenName,
        surname: profile.name.familyName,
        email: profile.emails[0].value
      }

      db["User"].findAll({
        where: {
          cEmail: user.email
        }
      })
      .then(users => {
        if (users.length == 0) {
          db["User"].create({
            cFirstName: user.name,
            cLastName: user.surname,
            cEmail: user.email
          })
          .then(user => {
            console.log(`Created new user with email ${user.cEmail}`);
          });
        }
        else
        {
          console.log(`${user.email} logged in`);
        }
      })

      return done(null, user);
    }
  ));

  passport.serializeUser(function(user, done) {
    return done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    db["User"].findAll({
      where: {
        cEmail: user.email
      }
    })
    .then(users => {
      if (users.length > 0) {
        done(null, user);
      }
    });
  });

  auth.get('/login', passport.authenticate('google', { scope : ['profile', 'email'] }));
  
  auth.get('/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/error',
    }),
    (req, res, next) => {
      const token = jwt.sign(
        {
          user: req.user
        },
        SECRET,
        {
          expiresIn: "12h",
        }
      );
      res.cookie('token', token);
      res.redirect('/');
    }
  );

  return auth;
}