const api = require("express").Router();
const path = require("path");
const root = require("../util/root");
const authenticated = require(path.join(root, "util", "isAuth"));

api.get("/", (req, res, next) => {
  res.status(200).json({ message: "[testRoutes.js] Hello From The API" });
});

api.get("/auth", authenticated, (req, res, next) => {
  res
    .status(200)
    .json({ message: "[testRoutes.js] Hello From The API With Auth" });
});

module.exports = api;
