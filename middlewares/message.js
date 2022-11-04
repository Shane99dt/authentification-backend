const { Message } = require("../models")

const checkIfMessageExists = async (req, res, next) => {
  const { messageId } = req.params

  try {
    const message = await Message.findOne({
      where: {
        id: messageId,
      },
    })

    if (message) {
      req.message = message
      console.log(message)
      next()
    }
  } catch (e) {
    res.status(500).json([{ msg: "Internal server error" }])
  }
}

module.exports = { checkIfMessageExists }
