const express = require("express")
const app = express()
const { body, validationResult } = require("express-validator")
const { Message, Product, User } = require("../models")
const moment = require("moment")
// const passport = require("../config/passport")
const { checkIfProductExists } = require("../middlewares/product")

app.post(
  "/:productId",
  body("description")
    .isLength({ min: 1 })
    .withMessage("Message cannot be empty")
    .isLength({ max: 200 })
    .withMessage("Message is too long"),
  async (req, res) => {
    const { productId } = req.params
    const { errors } = validationResult(req)

    // const product = await Product.findOne({
    //   where: {
    //     id: productId
    //   },
    //   include : [User]
    // })
    const { description, receiverId, senderId } = req.body

    /**
     * need to get the sender id which is the user
     *
     * the way to do that is to get the token and find a way to decrypt it
     * get the id which is encrypted inside the token and its ready
     */

    if (errors.length === 0) {
      const message = await Message.create({
        description,
        date: moment().format(),
        receiverId,
        senderId,
        productId,
      })
      res.json(message)
    } else {
      res.status(400).json(errors)
    }
  }
)

app.post(
  "/:id",
  // passport.authenticate("jwt"),
  body("description")
    .exists()
    .isLength({ min: 8 })
    .withMessage("Content is require"),
  checkIfProductExists,
  async (req, res) => {
    /**
     * messages -> productId
     * messages -> senderId
     * product receives many messages from different users
     * need to get all the messages according to the same user to a specific announe
     *
     * how to do that
     *
     * need to select the messages with a user and the product id
     *
     * if we send the productId with the params
     * it will let us get the every message that came to the product and it will definetely not help us
     * but we can divide all the messages by the sender id
     * kinda complicated but thats a way to do that
     *
     * if we send the senderId with the params
     * we can get all the messages sent by that sender
     *
     */

    const { description } = req.body
    const product = Product.findOne({
      where: {
        id: req.params.id,
      },
    })

    const message = await Message.create({
      description,
      senderId: req.user.id,
      receiverId: product.user.id,
      productId: req.params.id,
    })

    res.json(message)
    // const { id } = req.params
    // const message = await Message.findOne({
    //   where: {
    //     id,
    //   },
    // })
    // res.status(201).json(message)
  }
)

module.exports = app
