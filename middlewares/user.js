const { User } = require("../models")

const checkIfUserExists = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
    })

    if (user) {
      req.user = user
      next()
    }
  } catch (e) {
    res.status(500).json([{ msg: "Internal server error" }])
  }
}

module.exports = { checkIfUserExists }
