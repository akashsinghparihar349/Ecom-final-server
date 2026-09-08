const mongoose = require("mongoose")

const ContactUsSchema = new mongoose.Schema({
    name:{
      type:String,
      required : [true, "Name Field is Mendatory"]
    },
    email:{
      type:String,
      required : [true, "Email Field is Mendatory"]
    },
    phone:{
      type:String,
      required : [true, "Phone Field is Mendatory"]
    },
    subject:{
      type:String,
      required : [true, "Subject Field is Mendatory"]
    },
    message:{
      type:String,
      required : [true, "Message Field is Mendatory"]
    },
    status :{
      type:Boolean,
      default : true
    }
},{timestamps:true})

const ContactUs = new mongoose.model("ContactUs", ContactUsSchema)
module.exports = ContactUs