const mongoose = require("mongoose")

const BrandSchema = new mongoose.Schema({
    name:{
      type:String,
      required : [true, "Brand Name Field is Mendatory"],
      unique: true
    },
    pic:{
      type : String,
      required : [true , "Pic Field is Mendatory"]
    },
    status :{
      type:Boolean,
      default : true
    }
})

const Brand = new mongoose.model("Brand", BrandSchema)
module.exports = Brand