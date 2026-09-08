const nodemailer = require('nodemailer')

const mailer = nodemailer.createTransport({
  host:"smtp.gmail.com",
  port:587,
  secure:false,
  tls:true,
  auth:{
    user:process.env.MAIL_USERNAME,
    pass:process.env.MAIL_PASSWORD
  }
})

module.exports = mailer