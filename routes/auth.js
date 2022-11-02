const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const issueToken = require('../utils/jwt')
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

app.post('/login', async (req, res) => {
  const { email, password } = req.body

  console.log(User);

  const user = await User.findOne({
    where: {
      email
    }
  })

  if (!user) {
    res.status(404).send('Not found')
  } else {
    const validPassword = await bcrypt.compare(password, user.password)

    if (validPassword) {
      const token = issueToken({ id: user.id, email: user.email })

      res.json({
        token
      })
    } else {
      res.status(404).send('Not found')
    }
  }
})

module.exports = app