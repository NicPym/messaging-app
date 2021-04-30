const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
const root = require("./util/root");
const logger = require("./util/winston");
const mongoose = require("mongoose");
const port = 3000;

mongoose
  .connect(
    "mongodb+srv://HTMLLevelUp:WiOyjKXZnn7Mi3Hy@cluster0.4yqqn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    logger.log({
      logger: "info",
      message: `[Index.js]\tDB Connected`,
    });
  })
  .catch((err) => {
    logger.log({
      logger: "error",
      message: `[Index.js]\tDB Connection Error - ${err.message}`,
    });
    return;
  });

app.use(bodyParser.json({ limit: "10mb" }));
app.use(helmet());
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/", express.static(path.join(root, "..", "app", "dist", "app")));

const TestRoutes = require("./routes/testRoutes");
app.use("/tr", TestRoutes);

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

app.listen(port, () => {
  logger.log({
    logger: "info",
    message: `[Index.js]\tServer listening at http://localhost:${port}.`,
  });
});

module.exports = app;
