const CheckoutRouter = require("express").Router()
const { createRecord, getRecord, getUserRecord, getSingleRecord, updateRecord, deleteRecord, order, verifyOrder } = require('../controllers/checkout.controller')
const { verifyBuyer, verifyAdmin, verifySuperAdmin } = require("../middleware/auth.middleware")

CheckoutRouter.post("", verifyBuyer, createRecord)
CheckoutRouter.get("", verifyAdmin, getRecord)
CheckoutRouter.get("/:_id", verifyAdmin, getSingleRecord)
CheckoutRouter.get("/user/:user", verifyBuyer, getUserRecord)
CheckoutRouter.put("/:_id", verifyAdmin, updateRecord)
CheckoutRouter.delete("/:_id", verifySuperAdmin, deleteRecord)
CheckoutRouter.post("/order", verifyBuyer, order)
CheckoutRouter.post("/verify-order", verifyBuyer, verifyOrder)

module.exports = CheckoutRouter
