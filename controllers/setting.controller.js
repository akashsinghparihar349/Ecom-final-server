const Setting = require("../models/setting.model")

async function createRecord(req, res) {
  try {
    let data = await Setting.findOne()
    if (data) {
      data.siteName = req.body.siteName || data.siteName
      data.map1 = req.body.map1 || data.map1
      data.map2 = req.body.map2 || data.map2
      data.address = req.body.address || data.address
      data.email = req.body.email || data.email
      data.phone = req.body.phone || data.phone
      data.whatsapp = req.body.whatsapp || data.whatsapp
      data.facebook = req.body.facebook || data.facebook
      data.twitter = req.body.twitter || data.twitter
      data.linkedin = req.body.linkedin || data.linkedin
      data.instagram = req.body.instagram || data.instagram
      data.youtube = req.body.youtube || data.youtube
      data.telegram = req.body.telegram || data.telegram
      data.privacyPolicy = req.body.privacyPolicy || data.privacyPolicy
      data.termsAndConditions = req.body.termsAndConditions || data.termsAndConditions
      data.returnPolicy = req.body.returnPolicy || data.returnPolicy

    }
    else {
      data = new Setting(req.body)
    }

    await data.save()

    res.send({
      result: "Done",
      data: data
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      result: "Fail",
      reason: "Internal Server Error"
    })
  }
}
async function getRecord(req, res) {
  try {
    let data = await Setting.find()
    res.send({
      result: "Done",
      data: data,
      count: data.length
    })
  } catch (error) {
    res.status(500).send({
      result: "Fail",
      reason: "Internal Server Error"
    })
  }
}



module.exports = {
  createRecord,
  getRecord
}