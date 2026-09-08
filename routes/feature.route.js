const FeatureRouter = require("express").Router()
const { createRecord, getRecord, getSingleRecord, updateRecord, deleteRecord } = require('../controllers/feature.controller')
const { verifyAdmin, verifyPublic, verifySuperAdmin } = require("../middleware/auth.middleware")

FeatureRouter.post("", verifyAdmin, createRecord)
FeatureRouter.get("", verifyPublic, getRecord)
FeatureRouter.get("/:_id", verifyPublic, getSingleRecord)
FeatureRouter.put("/:_id", verifyAdmin, updateRecord)
FeatureRouter.delete("/:_id", verifySuperAdmin, deleteRecord)

module.exports = FeatureRouter
