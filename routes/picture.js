const express = require("express")
const multer = require("multer")

const app = express()

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname)
  },
})

const upload = multer({ storage: fileStorageEngine })

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "index.html"))
// })

// post the profile image
app.post("/profile", upload.single("image"), (req, res) => {
  console.log(req.file)
  res.send("Profile picture upload success")
})

// post the product image
app.post("/product", upload.single("image"), (req, res) => {
  console.log(req.file)
  res.send("Product picture upload success")
})

module.exports = app
