//getting all conversations of user
//checking if user email exists in
const chats = require("express").Router();
const authenticate = require("'../util/isAuth");

chats.get("/getMessages", authenticated, (req, res, next) => {
    res.status(200);
});

module.exports = chats;