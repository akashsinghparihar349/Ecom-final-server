const User = require("../models/user.model")
const passwordValidator = require('password-validator')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

const mailer = require("../helper/mailer.helper")

//Create a schema

// 7906651456

const schema = new passwordValidator()

//Add properties to it

schema
  .is().min(8)
  .is().max(100)
  .has().uppercase(1)
  .has().lowercase(1)
  .has().symbols(1)
  .has().digits(2)
  .has().not().spaces()
  .is().not().oneOf(['Passw0rd', 'Password123', 'Admin@123', 'User@123', 'Password@123']);


async function createRecord(req, res) {
  if (schema.validate(req.body.password)) {
    bcrypt.hash(req.body?.password, 12, async (error, hash) => {
      if (error) {
        res.status(400).send({
          result: "Fail",
          reason: "Internal Server Error"
        })
      } else {
        try {
          let data = new User(req.body)
          data.password = hash
          await data.save()
          res.send({
            result: "Done",
            data: data
          })

          mailer.sendMail({
            from: process.env.MAIL_USERNAME,
            to: data.email,
            subject: `Your Account Has Been Created :Team ${process.env.SITE_NAME}`,
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
                            Account Created Successfully
                          </p>

                        </td>
                      </tr>

                      <!-- Content -->
                      <tr>
                        <td style="padding:35px;">

                          <h2 style="margin:0 0 20px;color:#222222;font-size:23px;">
                            Welcome, ${data.name}!
                          </h2>

                          <p style="margin:0 0 20px;color:#555555;font-size:16px;line-height:27px;">
                            Thank you for creating an account with
                            <strong>${process.env.SITE_NAME}</strong>.
                            Your account has been successfully created.
                          </p>

                          <!-- Account Details -->
                          <table width="100%" cellpadding="12" cellspacing="0" border="0"
                            style="border:1px solid #e5e5e5;border-collapse:collapse;margin:25px 0;">

                            <tr style="background:#f8f9fa;">
                              <td style="font-weight:bold;color:#333333;width:160px;">
                                Name
                              </td>

                              <td style="color:#555555;">
                                ${data.name}
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
                                Account Status
                              </td>

                              <td style="color:#28a745;font-weight:bold;">
                                Active
                              </td>
                            </tr>


                          </table>

                          <p style="margin:0 0 25px;color:#555555;font-size:16px;line-height:27px;">
                            You can now browse our products, add items to your cart,
                            place orders, manage your profile, and enjoy a seamless
                            shopping experience.
                          </p>

                          <!-- Button -->
                          <table cellpadding="0" cellspacing="0" border="0" align="center">
                            <tr>
                              <td align="center" bgcolor="#0d6efd" style="border-radius:5px;">

                                <a href="${process.env.SITE_URL}"
                                  style="display:inline-block;padding:14px 32px;color:#ffffff;text-decoration:none;font-size:16px;font-weight:bold;">
                                  Start Shopping
                                </a>

                              </td>
                            </tr>
                          </table>

                          <p style="margin:30px 0 0;color:#777777;font-size:14px;line-height:24px;">
                            If you did not create this account, please contact our
                            support team immediately.
                          </p>

                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td align="center" style="background:#f8f9fa;padding:22px;border-top:1px solid #e5e5e5;">

                          <p style="margin:0;color:#666666;font-size:14px;">
                            Thank you for joining ${process.env.SITE_NAME}!
                          </p>

                          <p style="margin:8px 0 0;color:#999999;font-size:12px;">
                            © 2026 ${process.env.SITE_NAME}. All Rights Reserved.
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
          let errorMessage = error.keyValue ? Object.fromEntries(Object.keys(error.keyValue).map(key => [key, `User with this ${key} is Already Exist`])) : Object.fromEntries(Object.keys(error.errors).map(key => [key, error.errors[key].message]))
          res.status(Object.values(errorMessage).length !== 0 ? 400 : 500).send({
            result: "Fail",
            reason: Object.values(errorMessage).length !== 0 ? errorMessage : "Internal Server Error"
          })
        }
      }
    })
  }
  else {
    res.status(400).send({
      result: "Fail",
      reason: schema.validate(req.body?.password, { details: true }).map(x => x.message.replaceAll("string", "Password")).join("|")
    })
  }
}
async function getRecord(req, res) {
  try {
    let data = await User.find().sort({ _id: -1 })
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
    let data = await User.findOne({ _id: req.params._id })
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
    let data = await User.findOne({ _id: req.params._id })
    if (data) {
      data.name = req.body.name ?? data.name
      data.username = req.body.username ?? data.username
      data.email = req.body.email ?? data.email
      data.phone = req.body.phone ?? data.phone
      data.address = req.body.address ?? data.address
      data.status = req.body.status ?? data.status
      data.role = req.body.role ?? data.role
      await data.save();
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
    console.log(error)
    let errorMessage = error.keyValue ? Object.fromEntries(Object.keys(error.keyValue).map(key => [key, `User with this ${key} is Already Exist`])) : Object.fromEntries(Object.keys(error.errors).map(key => [key, error.errors[key].message]))
    res.status(Object.values(errorMessage).length !== 0 ? 400 : 500).send({
      result: "Fail",
      reason: Object.values(errorMessage).length !== 0 ? errorMessage : "Internal Server Error"
    })
  }

}

async function deleteRecord(req, res) {
  try {
    let data = await User.findOne({ _id: req.params._id })
    if (data) {
      await data.deleteOne()
    }
    res.send({
      result: "Done"
    })
  } catch (error) {
    let errorMessage = error.keyValue ? Object.fromEntries(Object.keys(error.keyValue).map(key => [key, `User with this name is Already Exist`])) : Object.fromEntries(Object.keys(error.errors).map(key => [key, error.errors[key].message]))
    res.status(Object.values(errorMessage).length !== 0 ? 400 : 500).send({
      result: "Fail",
      reason: Object.values(errorMessage).length !== 0 ? errorMessage : "Internal Server Error"
    })
  }
}

async function login(req, res) {
  try {
    let data = await User.findOne({
      $or: [
        { username: req.body.username },
        { email: req.body.username }
      ]
    })
    if (data) {
      if (await bcrypt.compare(req.body?.password, data.password)) {
       let token = jwt.sign({data},process.env.JWT_SECRET_KEY ,{expiresIn:"15 days"})
        res.send({
          result: "Done",
          data: data,
          token : token
        })
      }
      else {
        res.status(401).send({
          result: "Fail",
          reason: "Invalid Username or Password"
        })
      }
    }
    else {
      res.status(401).send({
        result: "Fail",
        reason: "Invalid Username or Password"
      })
    }
  } catch (error) {
    res.status(500).send({
      result: "Fail",
      reason: "Internal Server Error"
    })
  }
}


async function forgetPassword1(req, res) {
  try {
    let data = await User.findOne({
      $or: [
        { username: req.body.username },
        { email: req.body.username }
      ]
    })
    if (data) {
      let otp = Number(Math.random().toString().slice(2, 8).toString().padEnd(6, "1"))
      data.passwordResetOptions = {
        otp: otp,
        date: new Date()
      }

      await data.save()

      res.send({
        result: "Done",
        message: "OTP Has Been Send Your Registered Email Address"
      })

      mailer.sendMail({
        from: process.env.MAIL_USERNAME,
        to: data.email,
        subject: `OTP For Password Reset :Team ${process.env.SITE_NAME}`,
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
                            Password Reset Request
                          </p>

                        </td>
                      </tr>

                      <!-- Content -->
                      <tr>
                        <td style="padding:35px;">

                          <h2 style="margin:0 0 20px;color:#222222;font-size:23px;">
                            Hello ${data.username},
                          </h2>

                          <p style="margin:0 0 20px;color:#555555;font-size:16px;line-height:27px;">
                            We received a request to reset the password for your
                            <strong>${process.env.SITE_NAME}</strong> account.
                          </p>

                          <p style="margin:0 0 25px;color:#555555;font-size:16px;line-height:27px;">
                            Use the One-Time Password (OTP) below to continue resetting your password.
                          </p>

                          <!-- OTP -->
                          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:30px 0;">
                            <tr>
                              <td align="center">

                                <div
                                  style="display:inline-block;background:#f1f5ff;border:2px dashed #0d6efd;border-radius:8px;padding:18px 35px;">

                                  <p style="margin:0 0 8px;color:#666666;font-size:13px;">
                                    Password Reset OTP
                                  </p>

                                  <p style="margin:0;color:#0d6efd;font-size:32px;font-weight:bold;letter-spacing:8px;">
                                    ${otp}
                                  </p>

                                </div>

                              </td>
                            </tr>
                          </table>

                          <p style="margin:0 0 20px;color:#555555;font-size:15px;line-height:25px;text-align:center;">
                            This OTP is valid for <strong>10 minutes</strong>.
                          </p>

                          <!-- Security Notice -->
                          <table width="100%" cellpadding="15" cellspacing="0" border="0"
                            style="background:#fff8e6;border-left:4px solid #ffc107;margin:25px 0;">

                            <tr>
                              <td style="color:#555555;font-size:14px;line-height:23px;">
                                <strong>Security Notice:</strong><br>
                                Never share this OTP with anyone. Our team will never ask you for your password or OTP.
                              </td>
                            </tr>

                          </table>

                          <p style="margin:0;color:#777777;font-size:14px;line-height:24px;">
                            If you did not request a password reset, please ignore this email.
                            Your account password will remain unchanged.
                          </p>

                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td align="center" style="background:#f8f9fa;padding:22px;border-top:1px solid #e5e5e5;">

                          <p style="margin:0;color:#666666;font-size:14px;">
                            ${process.env.SITE_NAME} Support Team
                          </p>

                          <p style="margin:8px 0 0;color:#999999;font-size:12px;">
                            © 2026 ${process.env.SITE_NAME}. All Rights Reserved.
                          </p>

                        </td>
                      </tr>

                    </table>

                  </td>
                </tr>
              </table>
      `
      })
    }
    else {
      res.status(401).send({
        result: "Fail",
        reason: "No User Record Found"
      })
    }
  } catch (error) {
    res.status(500).send({
      result: "Fail",
      reason: "Internal Server Error"
    })
  }
}



async function forgetPassword2(req, res) {
  try {
    let data = await User.findOne({
      $or: [
        { username: req.body.username },
        { email: req.body.username }
      ]
    })
    if (data) {
      if (data.passwordResetOptions.otp == req.body.otp) {
        if ((Date.now() - data.passwordResetOptions.date) > 600000) {
          res.status(400).send({
            result: "Fail",
            message: "OTP Has Been Expired, Please Try Again"
          })
        }
        else {
          res.send({
            result: "Done"
          })
        }
      }
      else {
        res.status(400).send({
          result: "Fail",
          reason: "Invalid OTP"
        })
      }
    }
    else {
      res.status(401).send({
        result: "Fail",
        reason: "Unauthorized Activity"
      })
    }
  } catch (error) {
    res.status(500).send({
      result: "Fail",
      reason: "Internal Server Error"
    })
  }
}



async function forgetPassword3(req, res) {
  try {
    let data = await User.findOne({
      $or: [
        { username: req.body.username },
        { email: req.body.username }
      ]
    })
    if (data) {
      if (schema.validate(req.body.password)) {
        bcrypt.hash(req.body?.password, 12, async (error, hash) => {
          if (error) {
            res.status(400).send({
              result: "Fail",
              reason: "Internal Server Error"
            })
          } else {

            data.password = hash
            await data.save()
            res.send({
              result: "Done",
              data: data
            })

            mailer.sendMail({
              from: process.env.MAIL_USERNAME,
              to: data.email,
              subject: `Password Has Been Reset Successfully:Team ${process.env.SITE_NAME}`,
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
                                Password Reset Successful
                              </p>

                            </td>
                          </tr>

                          <!-- Content -->
                          <tr>
                            <td style="padding:35px;">

                              <h2 style="margin:0 0 20px;color:#222222;font-size:23px;">
                                Hello ${data.name},
                              </h2>

                              <p style="margin:0 0 20px;color:#555555;font-size:16px;line-height:27px;">
                                Your password for your
                                <strong>${process.env.SITE_NAME}</strong>
                                account has been successfully reset.
                              </p>

                              <!-- Success Status -->
                              <table width="100%" cellpadding="15" cellspacing="0" border="0"
                                style="background:#eaf8f0;border-left:4px solid #28a745;margin:25px 0;">

                                <tr>
                                  <td style="color:#333333;font-size:15px;line-height:24px;">

                                    <strong style="color:#28a745;">
                                      ✓ Password Reset Successful
                                    </strong>

                                    <br>

                                    Your new password is now active and you can use it to log in to your account.

                                  </td>
                                </tr>

                              </table>

                              <!-- Account Details -->
                              <table width="100%" cellpadding="12" cellspacing="0" border="0"
                                style="border:1px solid #e5e5e5;border-collapse:collapse;margin:25px 0;">

                                <tr style="background:#f8f9fa;">
                                  <td style="font-weight:bold;color:#333333;width:160px;">
                                    Account
                                  </td>

                                  <td style="color:#555555;">
                                    ${data.email}
                                  </td>
                                </tr>

                                <tr style="background:#f8f9fa;">
                                  <td style="font-weight:bold;color:#333333;">
                                    Status
                                  </td>

                                  <td style="color:#28a745;font-weight:bold;">
                                    Password Updated
                                  </td>
                                </tr>

                              </table>

                              <p style="margin:0 0 20px;color:#555555;font-size:15px;line-height:25px;">
                                If you made this change, no further action is required.
                              </p>

                              <table width="100%" cellpadding="15" cellspacing="0" border="0"
                                style="background:#fff8e6;border-left:4px solid #ffc107;margin:25px 0;">

                                <tr>
                                  <td style="color:#555555;font-size:14px;line-height:23px;">
                                    <strong>Security Notice:</strong><br>
                                    If you did not reset your password, please contact our support team immediately and secure your
                                    account.
                                  </td>
                                </tr>

                              </table>

                              <!-- Login Button -->
                              <table cellpadding="0" cellspacing="0" border="0" align="center">
                                <tr>
                                  <td align="center" bgcolor="#0d6efd" style="border-radius:5px;">

                                    <a href="${process.env.SITE_URL}/login"
                                      style="display:inline-block;padding:14px 32px;color:#ffffff;text-decoration:none;font-size:16px;font-weight:bold;">
                                      Login to Your Account
                                    </a>

                                  </td>
                                </tr>
                              </table>

                            </td>
                          </tr>

                          <!-- Footer -->
                          <tr>
                            <td align="center" style="background:#f8f9fa;padding:22px;border-top:1px solid #e5e5e5;">

                              <p style="margin:0;color:#666666;font-size:14px;">
                                ${process.env.SITE_NAME} Support Team
                              </p>

                              <p style="margin:8px 0 0;color:#999999;font-size:12px;">
                                © 2026 ${process.env.SITE_NAME}. All Rights Reserved.
                              </p>

                            </td>
                          </tr>

                        </table>

                      </td>
                    </tr>
                   </table>
      `
            })


          }
        })
      }
      else {
        res.status(400).send({
          result: "Fail",
          reason: schema.validate(req.body?.password, { details: true }).map(x => x.message.replaceAll("string", "Password")).join("|")
        })
      }
    }
    else {
      res.status(401).send({
        result: "Fail",
        reason: "Unauthorized Activity"
      })
    }
  } catch (error) {
    res.status(500).send({
      result: "Fail",
      reason: "Internal Server Error"
    })
  }
}


module.exports = {
  createRecord,
  getRecord,
  getSingleRecord,
  updateRecord,
  deleteRecord,
  login,
  forgetPassword1,
  forgetPassword2,
  forgetPassword3
}