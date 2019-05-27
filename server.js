const express = require("express");
const db = require("./data/accounts-model.js");

const server = express();
server.use(express.json());

server.get("/", (req, res) => {
  res.send("<h1>💸🤑💲budget server💲🤑💸</h1>");
});

// server.get("/api/accounts", async (req, res) => {
//   try {
//     await res.json(db.find());
//   } catch {
//     res.status(400).json({ errorMessage: "Error retreiving accounts" });
//   }
// });

server.get("/api/accounts", (req, res) => {
  db.find()
    .then(accounts => {
      res.json(accounts);
    })
    .catch(err => res.status(500).send(err));
});

server.get("/api/accounts/:id", (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(account => {
      if (!account) {
        res
          .status(404)
          .json({
            message: "The account with the specified ID does not exist."
          });
      }
      res.status(201).json(account);
    })
    .catch(err => {
      res.status(500).send({ error: "The account could not be retreived." });
    });
});

server.post("/api/accounts", (req, res) => {
  const { id, name, budget } = req.body;
  if (!name || !budget) {
    res.status(400).json({
      errorMessage: "Please provide a name and a budget amount for the account."
    });
  }
  db.add({
    name,
    budget
  })
    .then(addedAccount => {
      res.status(201).json(addedAccount);
    })
    .catch(err => {
      res.status(500).json({
        error: "There was an error while saving this account to the database"
      });
    });
});

server.delete("/api/accounts/:id", async (req, res) => {
  try {
    const accountToDelete = await db.findById(req.params.id);
    const count = await db.remove(req.params.id);
    if (count > 0) {
      res.status(200).json(accountToDelete);
    } else {
      res
        .status(404)
        .json({ message: "The account with the specified ID does not exist." });
    }
  } catch (error) {
    console.log(error);
    res
      .sendStatus(500)
      .json({ error: "The post information could not be retreived." });
  }
});

server.put("/api/accounts/:id", async (req, res) => {
  const { name, budget } = req.body;
  if (!name && !budget) {
    res.status(400).json({
      errorMessage: "Please include either a budget amount or a name to update"
    });
  }
  try {
    const count = await db.update(req.params.id, req.body);
    if (count === 1) {
      res.status(200).json(req.body);
    }
  } catch {
    res.status(404).json({ error: "The acount could not be modified" });
  }
});

module.exports = server;
