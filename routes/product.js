const express = require('express')
const { checkIfProductExists } = require('../middlewares/product')
const app = express()
const { Product } = require("../models")


/**
 * need two different get methods
 *
 * show all the products
 * show one product
 */

app.get('/:productId', checkIfProductExists, (req, res) => {
  res.status(201).json(req.product)
})

app.get('/', async (req, res) => {
  try {
    /**
     * If want, can add the query, to get in the price order
     */
    const products = await Product.findAll()
    res.status(201).json(products)
  }catch(e){
    res.status(201).json([{ msg: "Internal server error" }])
  }
})

module.exports = app