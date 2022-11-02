const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const issueToken = require('../utils/jwt')
const { User } = require('../models/index')
const { body, validationResult } = require('express-validator')

const passwordShortMessage = 'Password needs to be more than 8 characters'
const passwordLongMessage = 'Password needs to be less than 20 characters'


app.post('/signup',
  body('firstName').exists().withMessage('First name cannot be empty'),
  body('lastName').exists().withMessage('Last name cannot be empty'),
  body('password').isLength({min: 8}).withMessage(passwordShortMessage).isLength({max: 20}).withMessage(passwordLongMessage),
  body('email').isEmail().withMessage('Not an email'),

  async (req, res) => {

  const { errors } = validationResult(req)
  const { firstName, lastName, email, password } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)

  if(errors.length === 0 ){
    const user = await User.create({
      email,
      password : hashedPassword,
      firstName,
      lastName
    })

    res.json(user)
  } else{
    res.status(400).json(errors)
  }
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({
    where: {
      email
    }
  })

  if (!user) {
    res.status(404).json([{msg : "Not found"}])
  } else {
    const validPassword = await bcrypt.compare(password, user.password)
    console.log(user)
    if (validPassword) {
      const token = issueToken({ id: user.id, email: user.email })

      res.json({
        token
      })
    } else {
      res.status(404).json([{msg: "Not found"}])
    }
  }
})

module.exports = app