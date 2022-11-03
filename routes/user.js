const express = require("express")
const passport = require("../config/passport")
const { checkIfUserExists } = require("../middlewares/user")
const app = express()

app.get(
  "/:userId",
  passport.authenticate("jwt"),
  checkIfUserExists,
  (req, res) => {
    res.status(201).json(req.user)
  }
)

module.exports = app
