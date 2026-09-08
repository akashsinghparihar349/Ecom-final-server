const cartRouter = require("express").Router()
const { createRecord, getRecord, getSingleRecord, updateRecord, deleteRecord } = require('../controllers/cart.controller')
const { verifyBuyer } = require("../middleware/auth.middleware")
cartRouter.post("", verifyBuyer, createRecord)
cartRouter.get("/user/:user", verifyBuyer, getRecord)
cartRouter.get("/:_id", verifyBuyer, getSingleRecord)
cartRouter.put("/:_id", verifyBuyer, updateRecord)
cartRouter.delete("/:_id", verifyBuyer, deleteRecord)

module.exports = cartRouter
