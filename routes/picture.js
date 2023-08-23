const express = require("express")
const multer = require("../middlewares/multerConfig")
const passport = require("passport")
const { Picture } = require("../models")
const upload = require("../middlewares/multerConfig")

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
// app.post(
//   "/profile/",
//   passport.authenticate("jwt"),
//   multer.single("image"),
//   async (req, res) => {
//     //   console.log(req.file)
//     //   res.send("Profile picture upload success")
//     if (req.uploadError) {
//       res.status(400).json("Upload failed")
//     } else {
//       const picture = await Picture.create({
//         UserId: req.headers.UserId,
//         pictureName: `${process.env.BACKEND_SERVER}/${req.file.filename}`,
//       })
//       res.json(picture)
//     }
//   }
// )

// app.post("/:id/upload", multer.single("image"), async (req, res) => {
//   const image = await Picture.create({
//     UserId: req.params.id,
//     image_url: `${process.env.BACKEND_SERVER}/${req.file.filename}`,
//   })
//   res.json(image)
// })

// post the product image
// app.post(
//   "/:id/product",
//   passport.authenticate("jwt"),
//   multer.single("image"),
//   async (req, res) => {
//     const error = multer.MulterError
//     if (error) {
//       res.status(400).json("Upload failed")
//     } else {
//       console.log(req.file)
//       const picture = await Picture.create({
//         ProductId: req.params.id,
//         pictureName: `${process.env.BACKEND_SERVER}/${req.file.filename}`,
//       })
//       res.json(picture)
//     }
//   }
// )

app.post(
  "/product",
  passport.authenticate("jwt"),
  upload.single("image"),
  async (req, res) => {
    if (!req.file.originalname.match(/\.(jpg|JPG|JPEG|png|PNG|gif|GIF)$/)) {
      res.json([{ msg: "Only image files ...." }])
    } else {
      const picture = await Picture.create({
        pictureName: req.file.filename,
        UserId: req.user.id,
        ProductId: req.params.productId,
      })
      res.status(201).json(picture)
    }
  }
)

module.exports = app
