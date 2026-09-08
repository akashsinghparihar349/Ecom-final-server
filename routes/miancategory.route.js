const MaincategoryRouter = require("express").Router()
const { maincategoryUploader } = require("../middleware/fileUploader.middleware")

const { createRecord, getRecord, getSingleRecord, updateRecord, deleteRecord } = require('../controllers/miancategory.controller')
const { verifyAdmin, verifySuperAdmin, verifyPublic } = require("../middleware/auth.middleware")

MaincategoryRouter.post("", verifyAdmin, maincategoryUploader.single('pic'), createRecord)
MaincategoryRouter.get("", verifyPublic, getRecord)
MaincategoryRouter.get("/:_id", verifyPublic, getSingleRecord)
MaincategoryRouter.put("/:_id", verifyAdmin, maincategoryUploader.single('pic'), updateRecord)
MaincategoryRouter.delete("/:_id", verifySuperAdmin, deleteRecord)

module.exports = MaincategoryRouter
