const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
  const Picture = sequelize.define("Picture", {
    pictureName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  })

  return Picture
}
