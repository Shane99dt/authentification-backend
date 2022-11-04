const { Message } = require("../models")

const checkIfMessageExists = async (req, res, next) => {
  const { messageId } = req.params

  const message = await Message.findOne({
    where: {
      id: messageId,
    },
  })

  if (message) {
    req.message = message
    console.log(message)
    next()
  } else {
    res.status(404).json([{ msg: "Message not found" }])
  }
}

module.exports = { checkIfMessageExists }
