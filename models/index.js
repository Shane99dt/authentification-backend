const { Sequelize } = require("sequelize")
const { DB_HOST, DB_NAME, DB_PASSWORD, DB_USERNAME } = process.env

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql",
  logging: false,
})

const connectDB = async () => {
  try {
    await sequelize.authenticate()
    console.log("DB connected")
  } catch (e) {
    console.log(e)
  }
}

connectDB()

const Product = require("./product")(sequelize)
const Message = require("./message")(sequelize)
const Picture = require("./picture")(sequelize)
const User = require("./user")(sequelize)

Message.belongsTo(Product)
Message.belongsTo(User, { as: "sender" })
Message.belongsTo(User, { as: "receiver" })
Product.belongsTo(User)
Picture.belongsTo(Product)
Picture.belongsTo(User)

User.hasMany(Product)
User.hasOne(Picture)
Product.hasMany(Picture)
Product.hasMany(Message)

sequelize.sync({ alter: true })

const db = {
  sequelize,
  Product,
  Message,
  Picture,
  User,
}

module.exports = db
