const Newsletter = require("../models/newsletter.model")
const mailer = require("../helper/mailer.helper")
async function createRecord(req, res) {
  try {
    let data = new Newsletter(req.body)
    await data.save()
    res.send({
      result: "Done",
      data: data
    })

    mailer.sendMail({
      from: process.env.MAIL_USERNAME,
      to: data.email,
      subject: `Newsletter Subscription Confirmed :Team ${process.env.SITE_NAME}`,
      html: `
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6f9;padding:40px 0;">

            <tr>
              <td align="center">

                <table width="600" cellpadding="0" cellspacing="0" border="0"
                  style="background:#ffffff;border:1px solid #dddddd;border-radius:8px;">

                  <!-- Header -->
                  <tr>
                    <td align="center" style="background:#0d6efd;padding:30px;">

                      <h1 style="margin:0;color:#ffffff;font-size:30px;">
                        ${process.env.SITE_NAME}
                      </h1>

                      <p style="margin:10px 0 0;color:#dbe9ff;font-size:15px;">
                        Newsletter Subscription Confirmed
                      </p>

                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding:35px;">

                      <h2 style="margin:0 0 20px;color:#222222;font-size:23px;">
                        Thank You, Our Valuable Customer!
                      </h2>

                      <p style="margin:0 0 20px;color:#555555;font-size:16px;line-height:27px;">
                        You have successfully subscribed to the
                        <strong>${process.env.SITE_NAME}</strong> newsletter.
                        We're excited to have you as part of our community!
                      </p>

                      <!-- Success Message -->
                      <table width="100%" cellpadding="15" cellspacing="0" border="0"
                        style="background:#eaf8f0;border-left:4px solid #28a745;margin:25px 0;">

                        <tr>
                          <td style="color:#333333;font-size:15px;line-height:24px;">

                            <strong style="color:#28a745;font-size:17px;">
                              ✓ Subscription Successful
                            </strong>

                            <br><br>

                            You will now receive our latest updates, new product announcements,
                            exclusive offers, special discounts, and exciting news directly in your inbox.

                          </td>
                        </tr>

                      </table>

                      <!-- Subscription Details -->
                      <h3 style="margin:0 0 15px;color:#222222;font-size:18px;">
                        Subscription Details
                      </h3>

                      <table width="100%" cellpadding="12" cellspacing="0" border="0"
                        style="border:1px solid #e5e5e5;border-collapse:collapse;margin-bottom:25px;">

                        <tr style="background:#f8f9fa;">
                          <td style="font-weight:bold;color:#333333;width:170px;">
                          </td>

                          <td style="color:#555555;">
                            Our Valuable Customer
                          </td>
                        </tr>

                        <tr>
                          <td style="font-weight:bold;color:#333333;">
                            Email
                          </td>

                          <td style="color:#555555;">
                            ${data.email}
                          </td>
                        </tr>

                        <tr style="background:#f8f9fa;">
                          <td style="font-weight:bold;color:#333333;">
                            Subscription Date
                          </td>

                          <td style="color:#555555;">
                            ${new Date().toLocaleString()}
                          </td>
                        </tr>

                        <tr>
                          <td style="font-weight:bold;color:#333333;">
                            Status
                          </td>

                          <td style="color:#28a745;font-weight:bold;">
                            Subscribed
                          </td>
                        </tr>

                      </table>

                      <p style="margin:0 0 25px;color:#555555;font-size:15px;line-height:26px;">
                        Stay tuned for exciting deals, trending products, helpful updates,
                        and exclusive offers from ${process.env.SITE_NAME}.
                      </p>

                      <!-- Button -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:25px;">

                        <tr>
                          <td align="center">

                            <table cellpadding="0" cellspacing="0" border="0">
                              <tr>

                                <td align="center" bgcolor="#0d6efd" style="border-radius:6px;">

                                  <a href="${process.env.SITE_URL}"
                                    style="display:inline-block;width:220px;padding:16px 0;background:#0d6efd;color:#ffffff;text-decoration:none;font-size:17px;font-weight:bold;text-align:center;border-radius:6px;">
                                    Visit ${process.env.SITE_NAME}
                                  </a>

                                </td>

                              </tr>
                            </table>

                          </td>
                        </tr>

                      </table>

                      <p style="margin:30px 0 0;color:#777777;font-size:13px;line-height:22px;">
                        If you did not subscribe to our newsletter, you can safely ignore this email.
                      </p>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td align="center" style="background:#f8f9fa;padding:22px;border-top:1px solid #e5e5e5;">

                      <p style="margin:0;color:#666666;font-size:14px;">
                        Thank you for subscribing to ${process.env.SITE_NAME}!
                      </p>

                      <p style="margin:8px 0 0;color:#999999;font-size:12px;">
                        © 2026 ${process.env.SITE_NAME}. All Rights Reserved.
                        <br>
                        ${process.env.SITE_URL}
                      </p>

                    </td>
                  </tr>

                </table>

              </td>
            </tr>

          </table>
      `
    })

  } catch (error) {
    let errorMessage = error.keyValue ? Object.fromEntries(Object.keys(error.keyValue).map(key => [key, `This Email Address is Address Registered With Us`])) : Object.fromEntries(Object.keys(error.errors).map(key => [key, error.errors[key].message]))
    res.status(Object.values(errorMessage).length !== 0 ? 400 : 500).send({
      result: "Fail",
      reason: Object.values(errorMessage).length !== 0 ? errorMessage : "Internal Server Error"
    })
  }
}
async function getRecord(req, res) {
  try {
    let data = await Newsletter.find().sort({ _id: -1 })
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
async function getSingleRecord(req, res) {
  try {
    let data = await Newsletter.findOne({ _id: req.params._id })
    if (data) {
      res.send({
        result: "Done",
        data: data
      })
    }
    else {
      res.status(404).send({
        result: "Fail",
        reason: "No Such Exist"
      })
    }
  } catch (error) {
    res.status(500).send({
      result: "Fail",
      reason: "Internal Server Error"
    })
  }

}
async function updateRecord(req, res) {
  try {
    let data = await Newsletter.findOne({ _id: req.params._id })
    if (data) {
      data.status = req.body.status ?? data.status

      await data.save()
      res.send({
        result: "Done",
        data: data
      })
    }
    else {
      res.status(404).send({
        result: "Fail",
        reason: "No Such Exist"
      })
    }
  } catch (error) {
    res.status(500).send({
      result: "Fail",
      reason: "Internal Server Error"
    })
  }
}


async function unsubscribe(req, res) {
  try {
    let data = await Newsletter.findOne({ _id: req.params._id })
    if (data) {
      data.status = false

      await data.save()
      res.send({
        result: "Done",
        result : "Newsletter Unsubscribed"
      })
    }
    else {
      res.status(404).send({
        result: "Fail",
        reason: "No Such Exist"
      })
    }
  } catch (error) {
    res.status(500).send({
      result: "Fail",
      reason: "Internal Server Error"
    })
  }
}


async function deleteRecord(req, res) {
  try {
    let data = await Newsletter.findOne({ _id: req.params._id })
    if (data) {
      await data.deleteOne()
    }
    res.send({
      result: "Done"
    })
  } catch (error) {
    let errorMessage = error.keyValue ? Object.fromEntries(Object.keys(error.keyValue).map(key => [key, `Newsletter with this name is Already Exist`])) : Object.fromEntries(Object.keys(error.errors).map(key => [key, error.errors[key].message]))
    res.status(Object.values(errorMessage).length !== 0 ? 400 : 500).send({
      result: "Fail",
      reason: Object.values(errorMessage).length !== 0 ? errorMessage : "Internal Server Error"
    })
  }
}


module.exports = {
  createRecord,
  getRecord,
  getSingleRecord,
  updateRecord,
  deleteRecord,
  unsubscribe
}