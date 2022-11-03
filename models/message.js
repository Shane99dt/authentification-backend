const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
  const Message = sequelize.define("Message", {
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  })

  return Message
}
