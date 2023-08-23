const { User } = require("../models")

const checkIfUserExists = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      id: req.user.id,
    },
  })

  if (user) {
    req.user = user
    next()
  } else {
    res.status(404).json([{ msg: "User not found" }])
  }
}

const userAlreadyExists = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  })

  if (!user) {
    next()
  } else {
    res.status(404).json([{ msg: "User already exists" }])
  }
}

const checkIfSellerExists = async (req, res, next) => {
  const { sellerId } = req.params
  const seller = await User.findOne({
    where: {
      id: sellerId,
    },
  })

  if (seller) {
    req.seller = seller
    next()
  } else {
    res.status(404).json([{ msg: "User not found" }])
  }
}

module.exports = { checkIfUserExists, checkIfSellerExists, userAlreadyExists }
