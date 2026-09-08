const BrandRouter = require("express").Router()
const { brandUploader } = require("../middleware/fileUploader.middleware")
const { verifyPublic, verifyAdmin, verifySuperAdmin } = require("../middleware/auth.middleware")

const { createRecord, getRecord, getSingleRecord, updateRecord, deleteRecord } = require('../controllers/brand.controller')

BrandRouter.post("", verifyAdmin, brandUploader.single('pic'), createRecord)
BrandRouter.get("", verifyPublic, getRecord)
BrandRouter.get("/:_id", verifyPublic, getSingleRecord)
BrandRouter.put("/:_id", verifyAdmin, brandUploader.single('pic'), updateRecord)
BrandRouter.delete("/:_id", verifySuperAdmin, deleteRecord)

module.exports = BrandRouter
