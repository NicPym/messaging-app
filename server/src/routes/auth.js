const auth = require("express").Router();
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const jwt = require("jsonwebtoken");
const { SECRET } = require("../util/constants");
const path = require("path");
const root = require("../util/root");
const db = require("../models");
require("dotenv").config(path.join(root, ".env"));

const GOOGLE_CLIENT_ID = process.env.CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET;

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/auth/google/callback",
      },
      (accessToken, refreshToken, profile, done) => {
        const loggedInUser = {
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
        };

        db["User"]
          .findAll({
            where: {
              cEmail: loggedInUser.email,
            },
          })
          .then((users) => {
            if (users.length == 0) {
              db["User"]
                .create({
                  cFirstName: loggedInUser.firstName,
                  cLastName: loggedInUser.lastName,
                  cEmail: loggedInUser.email,
                })
                .then((createdUser) => {
                  console.log(
                    `Created new user with email ${createdUser.cEmail}`
                  );
                  return done(null, {
                    id: createdUser.pkUser,
                  });
                });
            } else {
              console.log(`${loggedInUser.email} logged in`);
              return done(null, {
                id: users[0].pkUser,
              });
            }
          });
      }
    )
  );

  passport.serializeUser(function (user, done) {
    return done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    db["User"]
      .findAll({
        where: {
          pkUser: user.id,
        },
      })
      .then((users) => {
        if (users.length > 0) {
          done(null, user);
        }
      });
  });

  auth.get(
    "/login",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  auth.get(
    "/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/error",
    }),
    (req, res, next) => {
      const token = jwt.sign(req.user, SECRET, {
        expiresIn: "12h",
      });
      res.cookie("token", token);
      res.redirect("/");
    }
  );

  return auth;
};
