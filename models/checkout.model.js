const mongoose = require("mongoose")

const CheckoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User Id Field is Mendatory"]
  },

  deliveryAddress: {
    type: Object,
    required: [true, "Delivery Address Field is Mendatory"]
  },
  orderStatus: {
    type: String,
    default: "Order Has Been Placed"
  },
  paymentMode: {
    type: String,
    default: "COD"
  },
  paymentStatus: {
    type: String,
    default: "Pending"
  },

  subtotal: {
    type: Number,
    required: [true, "Subtotal Amount Field is Mendatory"]
  },
  shipping: {
    type: Number,
    required: [true, "Shipping Amount Field is Mendatory"]
  },
  total: {
    type: Number,
    required: [true, "Total Amount Field is Mendatory"]
  },
  rppid: {
    type: String,
    default: ""
  },
  products: {
    type: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product Id Field is Mendatory"]
      },
      quantity: {
        type: Number,
        required: [true, "Cart Quantity Field is Mendatory"]
      },
      color: {
        type: String,
        required: [true, "Color Field is Mendatory"]
      },
      size: {
        type: String,
        required: [true, "Size Field is Mendatory"]
      },
      total: {
        type: Number,
        required: [true, "Cart Total Field is Mendatory"]
      },
    }],
    required: [true, "Carts Product are Required"],
    validate: {
      validator: function (v) {
        return v && v.length > 0;
      },
      message: 'please Provide Atleast One Size'
    }
  }
}, { timestamps: true })

const Checkout = new mongoose.model("Checkout", CheckoutSchema)
module.exports = Checkout