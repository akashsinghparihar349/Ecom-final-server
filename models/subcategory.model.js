const mongoose = require("mongoose")

const SubcategorySchema = new mongoose.Schema({
    name:{
      type:String,
      required : [true, "Subcategory Name Field is Mendatory"],
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

const Subcategory = new mongoose.model("Subcategory", SubcategorySchema)
module.exports = Subcategory