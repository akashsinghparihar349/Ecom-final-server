const SettingRouter = require("express").Router()
const { createRecord, getRecord } = require('../controllers/setting.controller')
const { verifyAdmin, verifyPublic } = require("../middleware/auth.middleware")

SettingRouter.post("", verifyAdmin, createRecord)
SettingRouter.get("", verifyPublic, getRecord)
module.exports = SettingRouter
  