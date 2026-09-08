const mongoose = require("mongoose")

const NewsletterSchema = new mongoose.Schema({
    email:{
      type:String,
      required : [true, "Newsletter Email Field is Mendatory"],
      unique: true
    },
    status :{
      type:Boolean,
      default : true
    }
})

const Newsletter = new mongoose.model("Newsletter", NewsletterSchema)
module.exports = Newsletter