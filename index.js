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

// let persons = [
//   {
//     id: 1,
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: 2,
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: 3,
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: 4,
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

// get main
app.get("/", (req, res) => {
  res.send("<h1>Working...</h1>");
});

// get info
app.get("/api/info", (req, res) => {
  const total = persons.length;
  const date = new Date();
  res.send(`<div>Phonebook has info for ${total} people <br/> ${date}</div>`);
});

// get all
app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => res.json(persons));
});

// get one person
app.get("/api/persons/:id", (req, res, next) => {
  // const id = Number(req.params.id);
  // const person = persons.find((person) => person.id === id);

  // // if exists
  // if (person) {
  //   res.json(person);
  // } else {
  //   res.status(404).end();
  // }

  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => {
      // console.log(err);
      // res.status(400).send({ error: "malformatted id" });
      next(err);
    });
});

// delete
app.delete("/api/persons/:id", (req, res, next) => {
  // const id = Number(req.params.id);
  // persons = persons.filter((person) => person.id !== id);
  // res.status(204).end();

  Person.findByIdAndDelete(req.params.id)
    .then((result) => res.status(204).end())
    .catch((err) => next(err));
});

const generateId = () => {
  return Math.floor(Math.random() * 10000);
};

// add new person
app.post("/api/persons", (req, res) => {
  const body = req.body;

  // ERRORS

  // verify content
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number missing",
    });
  }

  // create an array only with persons name
  // const verifPerson = persons.map((person) => person.name);

  // verify if exists
  // if (verifPerson.some((person) => body.name === person)) {
  //   return res.status(400).json({
  //     error: "name must be unique",
  //   });
  // }

  // CREATE

  const person = new Person({
    // id: generateId(),
    name: body.name,
    number: body.number,
  });

  // persons = persons.concat(person);
  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

// update contact
app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
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
  }

  next(error);
};

app.use(errorHandler);
