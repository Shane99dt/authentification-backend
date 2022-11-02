const { Sequelize } = require('sequelize')
const { DB_HOST, DB_NAME, DB_PASSWORD, DB_USERNAME } = process.env

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect : "mysql",
  logging : false
})


const connectDB = async () => {
  try{
    await sequelize.authenticate()
    console.log("DB connected")
  }catch (e) {
    console.log(e)
  }
}

connectDB()

const Product = require('./product')(sequelize)
const Message = require('./message')(sequelize)
const Picture = require('./picture')(sequelize)
const User = require('./user')(sequelize)

Product.belongsToMany(User, {
  through: "products_users"
})
User.belongsToMany(Product, {
  through: "products_users"
})

Message.belongsToMany(User, {
  through: "users_messages"
})
User.belongsToMany(Message, {
  through: "users_messages"
})

Message.belongsToMany(Product, {
  through: "products_messages"
})
Product.belongsToMany(Message, {
  through: "products_messages"
})


sequelize.sync({ alter: true })

const db = {
  sequelize,
  Product,
  Message,
  Picture,
  User
}

module.exports = db