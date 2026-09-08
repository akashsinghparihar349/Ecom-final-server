const multer = require("multer")
function generateUpload(folder) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `public/uploads/${folder}`)
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "_" + file.originalname)
    }
  })

  return multer({ storage: storage })
}

const maincategoryUploader = generateUpload("maincategory")
const subcategoryUploader = generateUpload("subcategory")
const brandUploader = generateUpload("brand")
const productUploader = generateUpload("product")


module.exports = {
  maincategoryUploader,
  subcategoryUploader,
  brandUploader,
  productUploader
}