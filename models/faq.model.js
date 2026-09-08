const mongoose = require("mongoose")

const FaqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "Faq Question is Mendatory"],
    unique: true
  },
  answer: {
    type: String,
    required: [true, "Faq Answer is Mendatory"]
  },
  status: {
    type: Boolean,
    default: true
  }
})

const Faq = new mongoose.model("Faq", FaqSchema)
module.exports = Faq