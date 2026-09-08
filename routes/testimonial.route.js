const TestimonialRouter = require("express").Router()
const { createRecord, getRecord, getSingleRecord, updateRecord, deleteRecord } = require('../controllers/testimonial.controller')
const { verifyBuyer, verifyPublic } = require("../middleware/auth.middleware")

TestimonialRouter.post("", verifyBuyer, createRecord)
TestimonialRouter.get("", verifyPublic, getRecord)
TestimonialRouter.get("/:_id", verifyPublic, getSingleRecord)
TestimonialRouter.put("/:_id", verifyBuyer, updateRecord)
TestimonialRouter.delete("/:_id", verifyPublic, deleteRecord)

module.exports = TestimonialRouter
