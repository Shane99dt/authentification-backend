require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const session = require('express-session')
const morgan = require('morgan')
const port = 5000
// const { PORT } = process.env
const loginRoutes = require('./routes/login')
const productRoutes = require('./routes/product')
const userRoutes = require('./routes/user')
require('./models/index')

app.use(cors())
app.use(express.json())
// app.use("/login", loginRoutes)
// app.use('/product', productRoutes)
// app.use('/user', userRoutes)

app.listen(port, ()=> {
  console.log(`Server running on port ${port}`)
})

