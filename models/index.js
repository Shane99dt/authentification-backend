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
sequelize.sync({ alter: true })

const db = {
  sequelize,
  Product
}

module.exports = db