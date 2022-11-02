const express = require('express')
const app = express()
const { body, validationResult } = require('express-validator')
const { Message, Product, User } = require('../models')
const moment = require('moment')

app.post('/:productId',
  body("description").isLength({ min: 1 }).withMessage("Message cannot be empty").isLength({ max: 200 }).withMessage("Message is too long"),
  async (req, res) =>{
    const { productId } = req.params
    const { errors } = validationResult(req)

    // const product = await Product.findOne({
    //   where: {
    //     id: productId
    //   },
    //   include : [User]
    // })
    const { description, receiverId, senderId } = req.body


    if(errors.length === 0){
      const message = await Message.create({
        description,
        date: moment().format(),
        receiverId,
        senderId,
        productId
      })
      res.json(message)
    }else{
      res.status(400).json(errors)
    }
})

app.get('/:id', async (req, res) => {
  const { id } = req.params
  const message = await Message.findOne({
    where: {
      id
    }
  })

  res.status(201).json(message)
})

module.exports = app