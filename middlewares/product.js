const { Product } = require('../models')

const checkIfProductExists = async (req, res, next) => {
  const { productId } = req.params

  try {
    const product = await Product.findOne({
      where: {
        id: productId
      }
    })

    if (product){
      req.product = product
      next()
    }

  }catch(e){
    res.status(500).json([{ msg: "Internal server error" }])
  }
}

module.exports = { checkIfProductExists }