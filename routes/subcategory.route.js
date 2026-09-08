const SubcategoryRouter = require("express").Router()
const { subcategoryUploader } = require("../middleware/fileUploader.middleware")

const { createRecord, getRecord, getSingleRecord, updateRecord, deleteRecord } = require('../controllers/subcategory.controller')
const { verifyAdmin, verifySuperAdmin, verifyPublic } = require("../middleware/auth.middleware")

SubcategoryRouter.post("", verifyAdmin, subcategoryUploader.single('pic'), createRecord)
SubcategoryRouter.get("", verifyPublic, getRecord)
SubcategoryRouter.get("/:_id", verifyPublic, getSingleRecord)
SubcategoryRouter.put("/:_id", verifyAdmin, subcategoryUploader.single('pic'), updateRecord)
SubcategoryRouter.delete("/:_id", verifySuperAdmin, deleteRecord)

module.exports = SubcategoryRouter
