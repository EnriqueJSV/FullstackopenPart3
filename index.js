require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

// create token with the content created
morgan.token("content", (req) => JSON.stringify(req.body));

app.use(express.json()); //permite el post
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :content"
  )
); // imprime en consola la info necesaria
app.use(cors()); //permite obtener la info para el front
app.use(express.static("dist")); //Para poder ver el front como principal

// get main
app.get("/", (req, res) => {
  res.send("<h1>Working...</h1>");
});

// get info
app.get("/api/info", (req, res) => {
  const date = new Date();
  Person.find({}).then((persons) =>
    res.send(
      `<div>Phonebook has info for ${persons.length} people <br/> ${date}</div>`
    )
  );
});

// get all
app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => res.json(persons));
});

// get one person
app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => {
      next(err);
    });
});

// delete
app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => res.status(204).end())
    .catch((err) => next(err));
});

// add new person
app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  // ERRORS

  // verify content
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number missing",
    });
  }

  // CREATE

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((err) => next(err));
});

// update contact
app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedContact) => res.json(updatedContact))
    .catch((err) => next(err));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// unknown endpoint
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

// error handler
const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);
