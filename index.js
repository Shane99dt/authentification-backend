require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const session = require('express-session')
const morgan = require('morgan')
const port = 5000

// app.use()

app.listen(port, ()=> {
  console.log(`Server running on port ${port}`)
})

