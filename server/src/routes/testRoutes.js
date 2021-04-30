const api = require("express").Router();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const message = require("../models/message");
const authenticated = require("../util/isAuth");
const { SECRET } = require("../util/constants");
const Message = require("../models/message");

api.get("/", (req, res, next) => {
  res.status(200).json({
    message: "[testRoutes.js] Hello From The API",
    success: true,
    data: null,
  });
});

api.post("/auth", authenticated, (req, res, next) => {
  res.status(200).json({
    message: "[testRoutes.js] Hello From The API With Auth",
    success: true,
    data: req.token,
  });
});

api.get("/getToken", (req, res, next) => {
  const token = jwt.sign(
    {
      email: "Test User",
      id: 0,
    },
    SECRET,
    {
      expiresIn: "12h",
    }
  );

  res.status(200).json({
    message: "New Token Created",
    success: true,
    data: { token: token },
  });
});

api.post("/postMessage", async (req, res, next) => {
  const message = new Message({
    description: req.body.description,
    sender: req.body.sender
  });

  await message.save();
  res.send(message);
});

module.exports = api;
