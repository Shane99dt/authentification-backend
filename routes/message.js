const express = require('express')
const app = express()
const { body, validationResult } = require('express-validator')
const { Message } = require('../models')
require('moment')

app.post('/:id',
  body("description").isLength({ min: 1 }).withMessage("Message cannot be empty").isLength({ max: 200 }).withMessage("Message is too long"),
  async (req, res) =>{

    const { errors } = validationResult(req)

    if(errors.length === 0){
      const message = await Message.create({
        description,
        date: moment().format()
      })
      res.json(message)
    }else{
      res.status(400).json(errors)
    }
})

module.exports = app