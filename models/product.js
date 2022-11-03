const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
  const Product = sequelize.define("Product", {
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productPrice: {
      type: DataTypes.INTEGER,
    },
    productDescription: {
      type: DataTypes.TEXT,
    },
  })
  return Product
}
