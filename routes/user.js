const express = require("express")
const passport = require("../config/passport")
const { checkIfUserExists } = require("../middlewares/user")
const app = express()

app.get("/", passport.authenticate("jwt"), checkIfUserExists, (req, res) => {
  res.status(201).json(req.user)
})

// app.put("/:userId", passport.authenticate("jwt"), (req, res) => {

// })

module.exports = app
