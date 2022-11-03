const express = require("express")
const app = express()
const bcrypt = require("bcrypt")
const passport = require("../config/passport")
const { checkIfUserExists } = require("../middlewares/user")
const { body, validationResult } = require("express-validator")

app.get("/", passport.authenticate("jwt"), checkIfUserExists, (req, res) => {
  res.status(201).json(req.user)
})

app.put(
  "/",
  passport.authenticate("jwt"),
  checkIfUserExists,
  body("firstName")
    .custom((value) => {
      if (!value) {
        return true
      } else {
        return value.length >= 0
      }
    })
    .withMessage("First name cannot be empty"),
  body("lastName")
    .custom((value) => {
      if (!value) {
        return true
      } else {
        return value.length >= 0
      }
    })
    .withMessage("Last name cannot be empty"),
  body("password")
    .custom((value) => {
      if (!value) {
        return true
      } else {
        return value.length >= 8 && value.length <= 20
      }
    })
    .withMessage("Password must be between 8-20 characters"),
  async (req, res) => {
    const { errors } = validationResult(req)

    // const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = req.user
    if (errors.length === 0) {
      await user.update({ ...user, ...req.body })
      await user.save()
      res.status(201).json(user)
    } else {
      res.status(400).json(errors)
    }
  }
)

module.exports = app
