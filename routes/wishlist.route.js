const WishlistRouter = require("express").Router()
const { createRecord, getRecord, getSingleRecord, updateRecord, deleteRecord } = require('../controllers/wishlist.controller')
const { verifyBuyer } = require("../middleware/auth.middleware")

WishlistRouter.post("", verifyBuyer, createRecord)
WishlistRouter.get("/user/:user", verifyBuyer, getRecord)
WishlistRouter.get("/:_id", verifyBuyer, getSingleRecord)
WishlistRouter.put("/:_id", verifyBuyer, updateRecord)
WishlistRouter.delete("/:_id", verifyBuyer, deleteRecord)

module.exports = WishlistRouter
