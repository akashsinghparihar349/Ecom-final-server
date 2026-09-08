const ContactUs = require("../models/contactus.model")
const mailer = require("../helper/mailer.helper")

async function createRecord(req, res) {
  try {
    let data = new ContactUs(req.body)
    await data.save()
    res.send({
      result: "Done",
      data: data
    })

    mailer.sendMail({
      from: process.env.MAIL_USERNAME,
      to: data.email,
      subject: `Your Query Has Been Recived :Team ${process.env.SITE_NAME}`,
      html: `
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6f9;padding:40px 0;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0"
        style="background:#ffffff;border:1px solid #dddddd;border-radius:8px;"> <!-- Header -->
        <tr>
          <td align="center" style="background:#0d6efd;padding:35px;">
            <h1 style="margin:0;color:#ffffff;font-size:30px;font-weight:bold;"> ${process.env.SITE_NAME} </h1>
            <p style="margin:10px 0 0;color:#dbe9ff;font-size:16px;"> Query Received Successfully </p>
          </td>
        </tr> <!-- Body -->
        <tr>
          <td style="padding:35px;">
            <h2 style="margin:0 0 20px;color:#222222;font-size:24px;"> Hello ${data.name}, </h2>
            <p style="margin:0 0 20px;color:#555555;font-size:16px;line-height:28px;"> Thank you for contacting
              <strong>${process.env.SITE_NAME}</strong>. We appreciate you reaching out to us. This email confirms that we have
              successfully received your query. </p>
            <p style="margin:0 0 25px;color:#555555;font-size:16px;line-height:28px;"> Our support team is currently
              reviewing your request and will respond as soon as possible, usually within <strong>24–48 business
                hours.</strong> </p> <!-- Details -->
            <table width="100%" cellpadding="10" cellspacing="0" border="0"
              style="border:1px solid #e5e5e5;border-collapse:collapse;margin:25px 0;">
              <tr style="background:#f8f9fa;">
                <td style="font-weight:bold;color:#333333;width:180px;">Reference ID</td>
                <td style="color:#555555;">${data._id}</td>
              </tr>
              <tr>
                <td style="font-weight:bold;color:#333333;">Subject</td>
                <td style="color:#555555;">${data.subject}</td>
              </tr>
              <tr style="background:#f8f9fa;">
                <td style="font-weight:bold;color:#333333;">Date</td>
                <td style="color:#555555;">${data.createdAt}</td>
              </tr>
              <tr>
                <td style="font-weight:bold;color:#333333;">Status</td>
                <td style="color:#28a745;font-weight:bold;"> Received & Under Review </td>
              </tr>
            </table>
            <p style="margin:0 0 25px;color:#555555;font-size:16px;line-height:28px;"> If you have any additional
              information regarding your request, simply reply to this email. Our team will be happy to assist you. </p>
            <!-- Button -->
            <table cellpadding="0" cellspacing="0" border="0" align="center">
              <tr>
                <td align="center" bgcolor="#0d6efd" style="border-radius:5px;"> <a href=${process.env.SITE_URL}
                    style="display:inline-block;padding:14px 32px;color:#ffffff;text-decoration:none;font-size:16px;font-weight:bold;">
                    Visit ${process.env.SITE_NAME} </a> </td>
              </tr>
            </table>
          </td>
        </tr> <!-- Footer -->
        <tr>
          <td align="center" style="background:#f8f9fa;padding:25px;border-top:1px solid #e5e5e5;">
            <p style="margin:0;color:#666666;font-size:14px;line-height:24px;"> Thank you for choosing
              <strong>${process.env.SITE_NAME}</strong>. </p>
            <p style="margin:10px 0 0;color:#999999;font-size:13px;line-height:22px;"> © 2026 ${process.env.SITE_NAME}. All Rights
              Reserved.<br> This is an automated email. Please do not reply unless you have additional information
              regarding your query. </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
      `
    })


    mailer.sendMail({
      from: process.env.MAIL_USERNAME,
      to: process.env.MAIL_USERNAME,
      subject: `New ContactUS Query Recived :Team ${process.env.SITE_NAME}`,
      html: `
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6f9;padding:40px 0;">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0" border="0"
            style="background:#ffffff;border:1px solid #dddddd;border-radius:8px;">

            <!-- Header -->
            <tr>
              <td align="center" style="background:#0d6efd;padding:30px;">
                <h1 style="margin:0;color:#ffffff;font-size:28px;">
                  ${process.env.SITE_NAME}
                </h1>

                <p style="margin:10px 0 0;color:#dbe9ff;font-size:15px;">
                  New Customer Query Received
                </p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:35px;">

                <h2 style="margin:0 0 20px;color:#222222;font-size:22px;">
                  New Query Notification
                </h2>

                <p style="margin:0 0 25px;color:#555555;font-size:16px;line-height:26px;">
                  A new customer query has been submitted through the ${process.env.SITE_NAME} website.
                  Please review the details below and respond to the customer accordingly.
                </p>

                <!-- Customer Details -->
                <table width="100%" cellpadding="12" cellspacing="0" border="0"
                  style="border:1px solid #e5e5e5;border-collapse:collapse;margin-bottom:25px;">

                  <tr style="background:#f8f9fa;">
                    <td style="font-weight:bold;color:#333333;width:160px;">
                      Reference ID
                    </td>
                    <td style="color:#555555;">
                      ${data._id}
                    </td>
                  </tr>

                  <tr>
                    <td style="font-weight:bold;color:#333333;">
                      Customer Name
                    </td>
                    <td style="color:#555555;">
                      ${data.name}
                    </td>
                  </tr>

                  <tr style="background:#f8f9fa;">
                    <td style="font-weight:bold;color:#333333;">
                      Email
                    </td>
                    <td style="color:#555555;">
                      ${data.email}
                    </td>
                  </tr>

                  <tr>
                    <td style="font-weight:bold;color:#333333;">
                      Subject
                    </td>
                    <td style="color:#555555;">
                      ${data.subject}
                    </td>
                  </tr>

                  <tr style="background:#f8f9fa;">
                    <td style="font-weight:bold;color:#333333;">
                      Date
                    </td>
                    <td style="color:#555555;">
                      ${data.createdAt}
                    </td>
                  </tr>

                </table>

                <!-- Customer Message -->
                <h3 style="margin:0 0 12px;color:#222222;font-size:18px;">
                  Customer Message
                </h3>

                <div style="background:#f8f9fa;border-left:4px solid #0d6efd;padding:18px;margin-bottom:25px;">
                  <p style="margin:0;color:#555555;font-size:15px;line-height:26px;">
                    ${data.message}
                  </p>
                </div>

                <p style="margin:0;color:#777777;font-size:14px;line-height:24px;">
                  Please respond to the customer at
                  <strong style="color:#333333;">${data.email}</strong>
                  at your earliest convenience.
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="background:#f8f9fa;padding:22px;border-top:1px solid #e5e5e5;">

                <p style="margin:0;color:#666666;font-size:14px;">
                  ${process.env.SITE_NAME}/admin Admin Notification
                </p>

                <p style="margin:8px 0 0;color:#999999;font-size:12px;">
                  This is an automated email generated by the ${process.env.SITE_URL} website.
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
    console.log(error)
    let errorMessage = Object.fromEntries(Object.keys(error.errors).map(key => [key, error.errors[key].message]))
    res.status(Object.values(errorMessage).length !== 0 ? 400 : 500).send({
      result: "Fail",
      reason: Object.values(errorMessage).length !== 0 ? errorMessage : "Internal Server Error"
    })
  }
}
async function getRecord(req, res) {
  try {
    let data = await ContactUs.find().sort({ _id: -1 })
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
    let data = await ContactUs.findOne({ _id: req.params._id })
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
    let data = await ContactUs.findOne({ _id: req.params._id })
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

async function deleteRecord(req, res) {
  try {
    let data = await ContactUs.findOne({ _id: req.params._id })
    if (data) {
      await data.deleteOne()
    }
    res.send({
      result: "Done"
    })
  } catch (error) {
    let errorMessage = error.keyValue ? Object.fromEntries(Object.keys(error.keyValue).map(key => [key, `ContactUs with this name is Already Exist`])) : Object.fromEntries(Object.keys(error.errors).map(key => [key, error.errors[key].message]))
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
  deleteRecord
}