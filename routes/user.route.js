const UserRouter = require("express").Router()
const { createRecord, getRecord, getSingleRecord, updateRecord, deleteRecord, login, forgetPassword1, forgetPassword2, forgetPassword3 } = require('../controllers/user.controller')
const { verifyPublic, verifyBuyer } = require("../middleware/auth.middleware")

UserRouter.post("", verifyPublic, createRecord)
UserRouter.get("", verifyBuyer, getRecord)
UserRouter.get("/:_id", verifyBuyer, getSingleRecord)
UserRouter.put("/:_id", verifyBuyer, updateRecord)
UserRouter.delete("/:_id", verifyBuyer, deleteRecord)
UserRouter.post("/login", verifyPublic, login)
UserRouter.post("/forget-password-1", verifyPublic, forgetPassword1)
UserRouter.post("/forget-password-2", verifyPublic, forgetPassword2)
UserRouter.post("/forget-password-3", verifyPublic, forgetPassword3)

module.exports = UserRouter
