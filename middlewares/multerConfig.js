const multer = require("multer")

// const MIME_TYPES = {
//   "image/jpg": "jpg",
//   "image/jpeg": "jpg",
//   "image/png": "png",
//   "image/svg": "svg",
// }

// const storageEngine = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, "public")
//   },
//   filename: (req, file, callback) => {
//     const extension = MIME_TYPES[file.mimetype]
//     callback(null, `${Date.now()}.${extension}`)
//   },
// })

// module.exports = multer({
//   storage: storageEngine,
// })

const storage = multer.diskStorage({
  destination: (re, file, cb) => {
    cb(null, "./")
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1]
    cb(null, `uploads/${file.originalname}-${Date.now()}.${ext}`)
  },
})

const upload = multer({
  storage,
})

module.exports = upload
