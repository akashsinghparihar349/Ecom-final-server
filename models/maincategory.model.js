const mongoose = require("mongoose")

const MaincategorySchema = new mongoose.Schema({
    name:{
      type:String,
      required : [true, "Maincategory Name Field is Mendatory"],
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

const Maincategory = new mongoose.model("Maincategory", MaincategorySchema)
module.exports = Maincategory