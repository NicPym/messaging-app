"use strict";
const jwt = require("jsonwebtoken");
const { SECRET } = require("./constants");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not Authenticated!");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken = "";
  try {
    decodedToken = jwt.verify(token, SECRET);
  } catch (err) {
    const error = new Error(
      "Authentication Session Expired! Please Log In Again."
    );
    error.statusCode = 401;
    throw error;
  }
  if (!decodedToken) {
    const error = new Error("Not Authenticated!");
    error.statusCode = 401;
    throw error;
  }
  req.token = decodedToken;
  next();
};
