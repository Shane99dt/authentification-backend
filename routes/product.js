const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.json("product")
})

module.exports = app