const express = require("express")
const { checkIfProductExists } = require("../middlewares/product")
const app = express()
const { Product, Message } = require("../models")
const { body, validationResult } = require("express-validator")
const { checkIfSellerExists } = require("../middlewares/user")
const passport = require("../config/passport")
// const { Op } = require("sequelize")
// const { checkIfMessageExists } = require("../middlewares/message")

/**
 * @All_Routes
 *
 * @get_one_product
 * /:productId
 *
 * @get_all_products
 * /
 *
 * @get_all_products_by_a_seller
 * /sell/:sellerId
 *
 * @get_seller
 * /seller/:sellerId
 *
 * @post_a_product
 * /
 *
 * @put_edit_a_product
 * /
 *
 * @delete_a_product
 * /:productId
 *
 * @get_all_the_messages_came_to_a_product
 * /:productId/messages
 *
 * @post_messages_according_to_the_product
 * /:productId/messages
 *
 */

/**
 * Get one product
 */

app.get("/:productId", checkIfProductExists, (req, res) => {
  res.status(201).json(req.product)
})

/**
 * Get the seller
 */

app.get("/seller/:sellerId", checkIfSellerExists, (req, res) => {
  res.status(201).json(req.seller)
})

/**
 * Get all the products
 */
app.get("/", async (req, res) => {
  try {
    /**
     * If want, can add the query, to get in the price order
     */
    const products = await Product.findAll()
    res.status(201).json(products)
  } catch (e) {
    res.status(400).json([{ msg: "Internal server error" }])
  }
})

/**
 * Get all the products by a seller
 */
app.get("/sell/:sellerId", checkIfSellerExists, async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        UserId: req.seller.id,
      },
    })
    res.status(201).json(products)
  } catch (e) {
    res.status(400).json([{ msg: "Internal server error" }])
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
  checkIfProductExists,
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

/**
 * Delete a product
 */

app.delete("/:productId", checkIfProductExists, async (req, res) => {
  await Product.destroy({
    where: {
      id: req.product.id,
    },
  })

  res.status(204)
})

/**
 * Messages
 *
 *
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

/**
 * Need to work on this method
 *
 * Need two routes two get messages
 * All messages came to the user --> this can be added in the user routes
 * All the messages that came to a product and filtered by the senderId
 * --> so we can get the all the messages to a product from a specific user(sender)
 */
// app.get(
//   "/:productId/messages/me",
//   passport.authenticate("jwt"),
//   checkIfProductExists,
//   async (req, res) => {
//     const { productId } = req.params

//     const messages = await Message.findAll({
//       where: {
//         [Op.and]: [{ productId }],
//       },
//     })

//     if (messages.length > 0) {
//       res.status(201).json(messages)
//     } else {
//       res.status(400).json([{ msg: "No Messages" }])
//     }
//   }
// )

/**
 * post message according to the product
 */

app.post(
  "/:productId/messages",
  passport.authenticate("jwt"),
  checkIfProductExists,
  body("description")
    .exists()
    .isLength({ min: 1 })
    .withMessage("Content is require"),
  async (req, res) => {
    const { description, receiverId } = req.body

    const message = await Message.create({
      description,
      senderId: req.user.id,
      receiverId,
      ProductId: req.params.productId,
    })

    res.json(message)
  }
)

/**
 * reply to the user
 */

// app.post(
//   "/:productId/messagesReply",
//   passport.authenticate("jwt"),
//   body("description")
//     .exists()
//     .isLength({ min: 8 })
//     .withMessage("Content is require"),
//   checkIfProductExists,
//   async (req, res) => {
//     const { description } = req.body

//     const message = await Message.create({
//       description,
//       senderId: req.user.id,
//       receiverId: req.product.UserId,
//       ProductId: req.params.productId,
//     })

//     res.json(message)
//   }
// )

/**
 * Delete a message
 */

// app.delete("/message/:messageId", checkIfMessageExists, async (req, res) => {
//   await Message.destroy({
//     where: {
//       id: req.message.id,
//     },
//   })

//   res.status(204)
// })

module.exports = app
