const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const personsRouter = require('./controllers/persons');
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const morgan = require("morgan");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

logger.info("connecting to:", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error(`error connecting to MongoDB: ${error.message}`);
  });

// create token with the content created
morgan.token("content", (req) => JSON.stringify(req.body));

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :content"
  )
); // imprime en consola la info necesaria

app.use(cors()); //permite obtener la info para el front
app.use(express.static("dist")); //Para poder ver el front como principal
app.use(express.json()); //permite el post
app.use(middleware.requestLogger)

app.use('/api/persons', personsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app