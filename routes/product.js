const express = require("express")
const { checkIfProductExists } = require("../middlewares/product")
const app = express()
const { Product } = require("../models")
const { body, validationResult } = require("express-validator")

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

module.exports = app
