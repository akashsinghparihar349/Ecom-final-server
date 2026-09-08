const ProductRouter = require("express").Router()
const { productUploader } = require("../middleware/fileUploader.middleware")

const { createRecord, getRecord, getSingleRecord, updateRecord, deleteRecord, updateRecordByUser } = require('../controllers/product.controller')
const { verifyAdmin, verifySuperAdmin, verifyPublic, verifyBuyer } = require("../middleware/auth.middleware")

ProductRouter.post("", verifyAdmin, productUploader.array('pic'), createRecord)
ProductRouter.get("", getRecord)
ProductRouter.get("/:_id", verifyPublic, getSingleRecord)
ProductRouter.put("/:_id", verifyAdmin, productUploader.array('pic'), updateRecord)
ProductRouter.put("/user/:_id", verifyBuyer, updateRecordByUser)
ProductRouter.delete("/:_id", verifySuperAdmin, deleteRecord)

module.exports = ProductRouter
