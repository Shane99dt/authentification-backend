const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
  const Picture = sequelize.define("Picture", {
    pictureName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  })

  return Picture
}
