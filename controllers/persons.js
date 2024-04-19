const personsRouter = require("express").Router();
const Person = require("../models/person");

// get all
personsRouter.get("/", (req, res) => {
  Person.find({}).then((persons) => res.json(persons));
});

// get info
personsRouter.get("/:info", (req, res) => {
  const date = new Date();
  Person.find({}).then((persons) =>
    res.send(
      `<div>Phonebook has info for ${persons.length} people <br/> ${date}</div>`
    )
  );
});

// get one person
personsRouter.get("/:id", (req, res, next) => {
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

// add new person
personsRouter.post("/", (req, res, next) => {
  const body = req.body;

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

// delete
personsRouter.delete("/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch((err) => next(err));
});

// update contact
personsRouter.put("/:id", (req, res, next) => {
  const { name, number } = req.body;

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedContact) => res.json(updatedContact))
    .catch((err) => next(err));
});

module.exports = personsRouter;
