const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
const root = require("./util/root");
const logger = require("./util/winston");
const { sequelize } = require("./models");
const passport = require('passport');
const cookieSession = require("cookie-session");
const port = 8080;

require("dotenv").config({ path: path.join(root, ".env") });

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieSession({
  name: 'session',
  secret: 'secret',
  maxAge: 24 * 60 * 60 * 1000 // 24 hours,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/", express.static(path.join(root, "public")));
app.use("/", express.static(path.join(root, "..", "app", "dist")));

const TestRoutes = require("./routes/testRoutes");
app.use("/tr", TestRoutes);
app.use("/auth", require("./routes/auth")(passport));
// app.use("/messages", require("./routes/messages"));


// Last 'use' call
app.use((error, req, res, next) => {
  logger.log({
    logger: "error",
    message: error.stack,
  });
  const status = error.statusCode || 500;
  const message = error.message.replace(/^\[.*\](\t){1,}/g, "");
  const data = error.data;
  res.status(status).json({ message: message, data: data, success: false });
});

// Syncs tables to the db
sequelize
  // .sync({ alter: true })
  .sync()
  .then(() => {
    const server = app.listen(port, () => {
      logger.log({
        logger: "info",
        message: `[Index.js]\tServer listening at http://localhost:${port}.`,
      });
    });

    const io = require("./routes/sockets")(server);
  })
  .catch((error) => {
    logger.log({
      logger: "error",
      message: "[Index]\t" + error,
    });
  });
module.exports = app;
