const express = require("express")
const { checkIfProductExists } = require("../middlewares/product")
const app = express()
const { Product, Message } = require("../models")
const { body, validationResult } = require("express-validator")
const { checkIfUserExists } = require("../middlewares/user")
const passport = require("../config/passport")
const { Op } = require("sequelize")

/**
 * need two different get methods
 *
 * show all the products
 * show one product
 */

app.get("/:productId", checkIfProductExists, (req, res) => {
  res.status(201).json(req.product)
})

app.get("/", async (req, res) => {
  try {
    /**
     * If want, can add the query, to get in the price order
     */
    const products = await Product.findAll()
    res.status(201).json(products)
  } catch (e) {
    res.status(201).json([{ msg: "Internal server error" }])
  }
})

/**
 * create a product
 */

app.post(
  "/",
  passport.authenticate("jwt"),
  body("productName")
    .isLength({ min: 4 })
    .withMessage("Title is too short")
    .isLength({ max: 30 })
    .withMessage("Title must be less than 30 characters"),
  body("productPrice").exists().isInt().withMessage("Price cannot be empty"),
  body("productDescription")
    .isLength({ min: 10 })
    .withMessage("Description is too short")
    .isLength({ max: 300 })
    .withMessage("Description is too long"),
  async (req, res) => {
    const { errors } = validationResult(req)
    const { productName, productPrice, productDescription } = req.body

    if (errors.length === 0) {
      const product = await Product.create({
        productName,
        productPrice,
        productDescription,
        UserId: req.user.id,
      })

      res.status(201).json(product)
    } else {
      res.status(400).json(errors)
    }
  }
)

/**
 * Edit a product
 */

app.put(
  "/:productId",
  passport.authenticate("jwt"),
  body("productName")
    .custom((value) => {
      if (!value) {
        return true
      } else {
        return value.length >= 4 && value.length <= 30
      }
    })
    .withMessage("Title must be between 10 & 30 characters"),
  body("productDescription")
    .custom((value) => {
      if (!value) {
        return true
      } else {
        return value.length >= 10 && value.length <= 300
      }
    })
    .withMessage("Description must be between 10 & 300 characters"),
  body("productPrice")
    .custom((value) => {
      if (!value) {
        return true
      } else {
        return value.length > 1
      }
    })
    .withMessage("Price cannot be empty"),
  checkIfProductExists,
  async (req, res) => {
    const { errors } = validationResult(req)
    const product = req.product

    if (errors.length === 0) {
      await product.update({ ...product, ...req.body })
      await product.save()
      res.status(201).json(product)
    } else {
      res.status(400).json(errors)
    }
  }
)

/*
 * Messages
 */

// Post a message
// app.post(
//   "/:productId/message",
//   body("description")
//     .isLength({ min: 1 })
//     .withMessage("Message cannot be empty")
//     .isLength({ max: 200 })
//     .withMessage("Message is too long"),
//   async (req, res) => {
//     const { productId } = req.params
//     const { errors } = validationResult(req)

//     // const product = await Product.findOne({
//     //   where: {
//     //     id: productId
//     //   },
//     //   include : [User]
//     // })
//     const { description, receiverId, senderId } = req.body

//     /**
//      * need to get the sender id which is the user
//      *
//      * the way to do that is to get the token and find a way to decrypt it
//      * get the id which is encrypted inside the token and its ready
//      */

//     if (errors.length === 0) {
//       const message = await Message.create({
//         description,
//         date: moment().format(),
//         receiverId,
//         senderId,
//         productId,
//       })
//       res.json(message)
//     } else {
//       res.status(400).json(errors)
//     }
//   }
// )

/**
 * Get all the messages came to the product from different users
 */

app.get(
  "/:productId/messages",
  passport.authenticate("jwt"),
  checkIfProductExists,
  async (req, res) => {
    const { productId } = req.params

    const messages = await Message.findAll({
      where: {
        productId,
      },
    })

    if (messages.length > 0) {
      res.status(201).json(messages)
    } else {
      res.status(400).json([{ msg: "No Messages" }])
    }
  }
)

/**
 * get messages from one user according to the product
 */
app.get(
  "/:productId/messages/me",
  passport.authenticate("jwt"),
  checkIfProductExists,
  async (req, res) => {
    const { productId } = req.params
    console.log(req.user)

    const messages = await Message.findAll({
      where: {
        [Op.and]: [{ productId }],
      },
    })

    if (messages.length > 0) {
      res.status(201).json(messages)
    } else {
      res.status(400).json([{ msg: "No Messages" }])
    }
  }
)

/**
 * post message according to the product
 */

app.post(
  "/:productId/message",
  passport.authenticate("jwt"),
  body("description")
    .exists()
    .isLength({ min: 8 })
    .withMessage("Content is require"),
  checkIfProductExists,
  async (req, res) => {
    const { description } = req.body

    const message = await Message.create({
      description,
      senderId: req.user.id,
      receiverId: req.product.userId,
      productId: req.params.productId,
    })

    res.json(message)
  }
)

module.exports = app
