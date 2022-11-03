const express = require("express")
const { checkIfUserExists } = require("../middlewares/user")
const app = express()

app.get("/:userId", checkIfUserExists, (req, res) => {
  res.status(201).json(req.user)
})

module.exports = app
