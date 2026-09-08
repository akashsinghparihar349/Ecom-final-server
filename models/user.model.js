const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User Full Name Field is Mendatory"]
  },
  username: {
    type: String,
    required: [true, "Username Field is Mendatory"],
    unique: true
  },
  email: {
    type: String,
    required: [true, "Email Address Field is Mendatory"],
    unique: true
  },
  phone: {
    type: String,
    required: [true, "Phone Number Field is Mendatory"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Password Field is Mendatory"]
  },
  role: {
    type: String,
    default: "Buyer"
  },
  passwordResetOptions: {
    type: Object,
    default: {}
  },
  address: {
    type: Array,
    default: []
  },
  status: {
    type: Boolean,
    default: true
  }
})

const User = new mongoose.model("User", UserSchema)
module.exports = User