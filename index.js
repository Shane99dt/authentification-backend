require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const session = require("express-session")
const { PORT } = process.env
const productRoutes = require("./routes/product")
const userRoutes = require("./routes/user")
const authRoutes = require("./routes/auth")
const messageRoutes = require("./routes/message")
require("./models/index")

app.use(cors())
app.use(express.json())

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
  })
)

app.use("/auth", authRoutes)
app.use("/message", messageRoutes)
app.use("/product", productRoutes)
app.use("/user", userRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
