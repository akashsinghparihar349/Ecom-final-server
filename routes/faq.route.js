const FaqRouter = require("express").Router()
const { createRecord, getRecord, getSingleRecord, updateRecord, deleteRecord } = require('../controllers/faq.controller')
const { verifyAdmin, verifySuperAdmin, verifyPublic } = require("../middleware/auth.middleware")

FaqRouter.post("", verifyAdmin, createRecord)
FaqRouter.get("", verifyPublic, getRecord)
FaqRouter.get("/:_id", verifyPublic, getSingleRecord)
FaqRouter.put("/:_id", verifyAdmin, updateRecord)
FaqRouter.delete("/:_id", verifySuperAdmin, deleteRecord)

module.exports = FaqRouter
