const ContactUsRouter = require("express").Router()
const { createRecord, getRecord, getSingleRecord, updateRecord, deleteRecord } = require('../controllers/contactus.controller')
const { verifyPublic, verifyAdmin, verifySuperAdmin } = require("../middleware/auth.middleware")

ContactUsRouter.post("", verifyPublic, createRecord)
ContactUsRouter.get("", verifyAdmin, getRecord)
ContactUsRouter.get("/:_id", verifyAdmin, getSingleRecord)
ContactUsRouter.put("/:_id", verifyAdmin, updateRecord)
ContactUsRouter.delete("/:_id", verifySuperAdmin, deleteRecord)

module.exports = ContactUsRouter
