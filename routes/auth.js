const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
// const issueToken = require('../utils/jwt')
const { User } = require('../models/index')

app.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password } = req.body

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({
    email,
    password : hashedPassword,
    firstName,
    lastName
  })

  res.json(user)
})

app.get('/signup', (req, res) => {
  res.json('hello')
})

module.exports = app