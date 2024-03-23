const express = require("express");
const app = express();

app.use(express.json());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

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
  res.json(persons);
});

// get one person
app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  // if exists
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

// delete
app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

const generateId = () => {
  return Math.floor(Math.random() * 10000);
};

// add new person
app.post("/api/persons", (req, res) => {
  const body = req.body;

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  res.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
