const { Product } = require("../models")

const checkIfProductExists = async (req, res, next) => {
  const { productId } = req.params
  const product = await Product.findOne({
    where: {
      id: productId,
    },
  })

  if (product) {
    req.product = product
    next()
  } else {
    res.status(404).json([{ msg: "Product not found" }])
  }
}

module.exports = { checkIfProductExists }
