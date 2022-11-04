const express = require("express")
const multer = require("../middlewares/multerConfig")
const passport = require("passport")
const { Picture } = require("../models")

const app = express()

// const fileStorageEngine = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./images")
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "--" + file.originalname)
//   },
// })

// const upload = multer({ storage: fileStorageEngine })

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "index.html"))
// })

// post the profile image
app.post("/profile", multer.single("image"), (req, res) => {
  console.log(req.file)
  res.send("Profile picture upload success")
})

// post the product image
app.post(
  "/:id/product",
  passport.authenticate("jwt"),
  multer.single("image"),
  async (req, res) => {
    const error = multer.MulterError
    if (error) {
      res.status(400).json("Upload failed")
    } else {
      console.log(req.file)
      const picture = await Picture.create({
        ProductId: req.headers.productId,
        pictureName: `${process.env.BACKEND_SERVER}/${req.file.filename}`,
      })
      res.json(picture)
    }
  }
)

module.exports = app
