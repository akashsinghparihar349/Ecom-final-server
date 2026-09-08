const Checkout = require("../models/checkout.model")
const mailer = require("../helper/mailer.helper")

const Razorpay = require("razorpay")

//Payment API
async function order(req, res) {
  try {
    const instance = new Razorpay({
      key_id: process.env.RPKEYID,
      key_secret: process.env.RPSECRETKEY,
    });

    const options = {
      amount: req.body.amount * 100,
      currency: "INR"
    }

    instance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Something Went Wrong!" })
      }
      res.json({ data: order })
    })
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" })
    console.log(error)
  }
}

async function verifyOrder(req, res) {
  try {
    var check = await Checkout.findOne({ _id: req.body.checkid })
    check.rppid = req.body.razorpay_payment_id
    check.paymentStatus = "Done"
    check.paymentMode = "Net Banking"
    await check.save()
    res.status(200).send({ result: "Done", message: "Payment SuccessFull" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server Error!" })
  }
}

async function createRecord(req, res) {
  try {
    let data = new Checkout(req.body)
    await data.save()
    let finalData = await Checkout.findOne({ _id: data._id })
      .populate("user", ["name", "username"])
      .populate({
        path: "products.product",
        select: "name brand stockQuantity finalPrice pic",
        populate: {
          path: "brand",
          select: "-_id name"
        },
        options: {
          slice: {
            pic: 1
          }
        }
      })
    res.send({
      result: "Done",
      data: finalData
    })

    let year = new Date(data.createdAt).getUTCFullYear()

    let products = finalData.products?.map((item, index) => {
      return ` <tr>

          <td style="border-top:1px solid #e5e5e5;color:#555555;padding:10px;">
            ${item.product?.name}
          </td>
          <td style="border-top:1px solid #e5e5e5;color:#555555;padding:10px;">
            ${item.product?.brand?.name}
          </td>
          <td style="border-top:1px solid #e5e5e5;color:#555555;padding:10px;">
            ${item.color}
          </td>
          <td style="border-top:1px solid #e5e5e5;color:#555555;padding:10px;">
            ${item.size}
          </td>

          <td align="right"
            style="border-top:1px solid #e5e5e5;color:#555555;padding:10px;">
            ₹${item.product?.finalPrice}
          </td>

          <td align="center"
            style="border-top:1px solid #e5e5e5;color:#555555;padding:10px;">
          ${item.quantity}
          </td>

          
          <td align="right"
            style="border-top:1px solid #e5e5e5;color:#555555;padding:10px;">
            ₹${item.total}
          </td>

        </tr>`
    }).join("")

    mailer.sendMail({
      from: process.env.MAIL_USERNAME,
      to: finalData.deliveryAddress?.email,
      subject: `Your Order Has Been Placed :Team ${process.env.SITE_NAME}`,
      html: `
            <table width="600" cellpadding="0" cellspacing="0" border="0"style="background:#ffffff;border:1px solid #dddddd;border-radius:8px;">
                  <!-- Header -->
                  <tr>
                    <td align="center" style="background:#0d6efd;padding:30px;">

                      <h1 style="margin:0;color:#ffffff;font-size:30px;">
                        ${process.env.SITE_NAME}
                      </h1>

                      <p style="margin:10px 0 0;color:#dbe9ff;font-size:15px;">
                        Order Placed Successfully
                      </p>

                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding:35px;">

                      <h2 style="margin:0 0 20px;color:#222222;font-size:23px;">
                        Thank You, ${finalData.deliveryAddress?.name}!
                      </h2>

                      <p style="margin:0 0 20px;color:#555555;font-size:16px;line-height:27px;">
                        Your order has been successfully placed with
                        <strong>${process.env.SITE_NAME}</strong>.
                        We have received your order and will start processing it shortly.
                      </p>

                      <!-- Success Message -->
                      <table width="100%" cellpadding="15" cellspacing="0" border="0"
                        style="background:#eaf8f0;border-left:4px solid #28a745;margin:25px 0;">

                        <tr>
                          <td style="color:#333333;font-size:15px;line-height:24px;">

                            <strong style="color:#28a745;">
                              ✓ Order Confirmed
                            </strong>

                            <br>

                            Your order has been successfully received and is being processed.

                          </td>
                        </tr>

                      </table>

                      <!-- Order Details -->
                      <h3 style="margin:0 0 15px;color:#222222;font-size:18px;">
                        Order Details
                      </h3>

                      <table width="100%" cellpadding="12" cellspacing="0" border="0"
                        style="border:1px solid #e5e5e5;border-collapse:collapse;margin-bottom:25px;">

                        <tr style="background:#f8f9fa;">
                          <td style="font-weight:bold;color:#333333;width:170px;">
                            Order ID
                          </td>

                          <td style="color:#555555;">
                            ${finalData._id}
                          </td>
                        </tr>

                        <tr>
                          <td style="font-weight:bold;color:#333333;">
                            Order Date
                          </td>

                          <td style="color:#555555;">
                            ${finalData.createdAt?.toLocaleString()}
                          </td>
                        </tr>

                        <tr style="background:#f8f9fa;">
                          <td style="font-weight:bold;color:#333333;">
                            Payment Method
                          </td>

                          <td style="color:#555555;">
                          ${finalData.paymentMode}
                          </td>
                        </tr>

                        <tr>
                          <td style="font-weight:bold;color:#333333;">
                            Order Status
                          </td>

                          <td style="color:#28a745;font-weight:bold;">
                          ${finalData.orderStatus}
                          </td>
                        </tr>

                      </table>

                      <!-- Order Summary -->
                      <h3 style="margin:0 0 15px;color:#222222;font-size:18px;">
                        Order Summary
                      </h3>

                      <table width="100%" cellpadding="10" cellspacing="0" border="0"
                        style="border:1px solid #e5e5e5;border-collapse:collapse;">

                        <tr style="background:#0d6efd;">

                          <th align="left" style="color:#ffffff;font-size:14px;">
                            Product
                          </th>

                          <th align="left" style="color:#ffffff;font-size:14px;">
                            Brand
                          </th>

                          <th align="left" style="color:#ffffff;font-size:14px;">
                            Color
                          </th>

                          <th align="left" style="color:#ffffff;font-size:14px;">
                            Size
                          </th>

                          <th align="right" style="color:#ffffff;font-size:14px;">
                            Price
                          </th>

                          <th align="center" style="color:#ffffff;font-size:14px;">
                            Quantity
                          </th>

                          <th align="right" style="color:#ffffff;font-size:14px;">
                            Total
                          </th>

                        </tr>

                        ${products}

                      </table>

                      <!-- Price Summary -->
                      <table width="100%" cellpadding="10" cellspacing="0" border="0"
                        style="margin-top:20px;">

                        <tr>
                          <td align="right" style="color:#555555;font-size:15px;">
                            Subtotal:
                          </td>

                          <td align="right"
                            style="color:#333333;font-size:15px;width:120px;">
                            ₹${finalData.subtotal}
                          </td>
                        </tr>

                        <tr>
                          <td align="right" style="color:#555555;font-size:15px;">
                            Shipping:
                          </td>

                          <td align="right" style="color:#333333;font-size:15px;">
                            ₹${finalData.shipping}
                          </td>
                        </tr>

                        <tr>
                          <td align="right"
                            style="padding-top:12px;color:#222222;font-size:18px;font-weight:bold;">
                            Total:
                          </td>

                          <td align="right"
                            style="padding-top:12px;color:#0d6efd;font-size:18px;font-weight:bold;">
                            ₹${finalData.total}
                          </td>
                        </tr>

                      </table>

                      <!-- Delivery Address -->
                      <h3 style="margin:30px 0 12px;color:#222222;font-size:18px;">
                        Delivery Address
                      </h3>

                      <div style="background:#f8f9fa;border-left:4px solid #0d6efd;padding:16px;">

                        <p style="margin:0;color:#555555;font-size:15px;line-height:25px;">
                          ${finalData.deliveryAddress?.name}<br>
                          ${finalData.deliveryAddress?.address}<br>
                          ${finalData.deliveryAddress?.city}, ${finalData.deliveryAddress?.state} - ${finalData.deliveryAddress?.pin}<br>
                          Phone: ${finalData.deliveryAddress?.phone}
                        </p>

                      </div>

                      <!-- View Order Button -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:30px;">
                        <tr>
                          <td align="center">

                            <table cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td align="center" bgcolor="#0d6efd" style="border-radius:6px;">

                                  <a href="${process.env.SITE_URL}/profile?options=Orders"
                                    style="display:inline-block;width:260px;padding:20px 0;background:#0d6efd;color:#ffffff;text-decoration:none;font-size:20px;font-weight:bold;text-align:center;border-radius:6px;">
                                    View Your Order
                                  </a>

                                </td>
                              </tr>
                            </table>

                          </td>
                        </tr>
                      </table>

                      <p style="margin:25px 0 0;color:#555555;font-size:15px;line-height:26px;">
                        We will notify you when your order is shipped.
                        Thank you for choosing <strong>${process.env.SITE_NAME}</strong>.
                      </p>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td align="center"
                      style="background:#f8f9fa;padding:22px;border-top:1px solid #e5e5e5;">

                      <p style="margin:0;color:#666666;font-size:14px;">
                        Thank you for shopping with ${process.env.SITE_NAME}!
                      </p>

                      <p style="margin:8px 0 0;color:#999999;font-size:12px;">
                        © ${year} ${process.env.SITE_NAME}. All Rights Reserved.
                      </p>
                        ${process.env.SITE_URL}
                    </td>
                  </tr>

                </table>
        `
    })


    mailer.sendMail({
      from: process.env.MAIL_USERNAME,
      to: process.env.MAIL_USERNAME,
      subject: `New Order Received :Team ${process.env.SITE_NAME}`,
      html: `
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6f9;padding:40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" border="0"
                    style="background:#ffffff;border:1px solid #dddddd;border-radius:8px;"> <!-- Header -->
                    <tr>
                      <td align="center" style="background:#0d6efd;padding:30px;">
                        <h1 style="margin:0;color:#ffffff;font-size:30px;"> ${process.env.SITE_NAME} </h1>
                        <p style="margin:10px 0 0;color:#dbe9ff;font-size:15px;"> New Order Received </p>
                      </td>
                    </tr> <!-- Content -->
                    <tr>
                      <td style="padding:35px;">
                        <h2 style="margin:0 0 20px;color:#222222;font-size:23px;"> New Order Alert </h2>
                        <p style="margin:0 0 20px;color:#555555;font-size:16px;line-height:27px;"> A new order has been
                          successfully placed on <strong>${process.env.SITE_NAME}</strong>. Please review the order details below.
                        </p> <!-- Order Status -->
                        <table width="100%" cellpadding="15" cellspacing="0" border="0"
                          style="background:#eaf8f0;border-left:4px solid #28a745;margin:25px 0;">
                          <tr>
                            <td style="color:#333333;font-size:15px;line-height:24px;"> <strong style="color:#28a745;"> ✓ New
                                Order Received </strong> <br> A customer has successfully placed an order. </td>
                          </tr>
                        </table> <!-- Customer Details -->
                        <h3 style="margin:0 0 15px;color:#222222;font-size:18px;"> Customer Details </h3>
                        <table width="100%" cellpadding="12" cellspacing="0" border="0"
                          style="border:1px solid #e5e5e5;border-collapse:collapse;margin-bottom:25px;">
                          <tr style="background:#f8f9fa;">
                            <td style="font-weight:bold;color:#333333;width:170px;"> Customer Name </td>
                            <td style="color:#555555;"> ${finalData.deliveryAddress?.name} </td>
                          </tr>
                          <tr>
                            <td style="font-weight:bold;color:#333333;"> Email </td>
                            <td style="color:#555555;"> ${finalData.deliveryAddress?.email} </td>
                          </tr>
                          <tr style="background:#f8f9fa;">
                            <td style="font-weight:bold;color:#333333;"> Phone </td>
                            <td style="color:#555555;"> ${finalData.deliveryAddress?.phone} </td>
                          </tr>
                        </table> <!-- Order Details -->
                        <h3 style="margin:0 0 15px;color:#222222;font-size:18px;"> Order Details </h3>
                        <table width="100%" cellpadding="12" cellspacing="0" border="0"
                          style="border:1px solid #e5e5e5;border-collapse:collapse;margin-bottom:25px;">
                          <tr style="background:#f8f9fa;">
                            <td style="font-weight:bold;color:#333333;width:170px;"> Order ID </td>
                            <td style="color:#555555;">  ${finalData._id} </td>
                          </tr>
                          <tr>
                            <td style="font-weight:bold;color:#333333;"> Order Date </td>
                            <td style="color:#555555;"> ${finalData.createdAt?.toLocaleString()} </td>
                          </tr>
                          <tr style="background:#f8f9fa;">
                            <td style="font-weight:bold;color:#333333;"> Payment Method </td>
                            <td style="color:#555555;"> ${finalData.paymentMode} </td>
                          </tr>
                          <tr>
                            <td style="font-weight:bold;color:#333333;"> Order Status </td>
                            <td style="color:#28a745;font-weight:bold;"> ${finalData.orderStatus} </td>
                          </tr>
                        </table> <!-- Order Summary -->
                        
                        <h3 style="margin:0 0 15px;color:#222222;font-size:18px;">
                          Order Summary
                        </h3>

                        <table width="100%" cellpadding="10" cellspacing="0" border="0"
                          style="border:1px solid #e5e5e5;border-collapse:collapse;">

                          <tr style="background:#0d6efd;">

                            <th align="left" style="color:#ffffff;font-size:14px;">
                              Product
                            </th>

                            <th align="left" style="color:#ffffff;font-size:14px;">
                              Brand
                            </th>

                            <th align="left" style="color:#ffffff;font-size:14px;">
                              Color
                            </th>

                            <th align="left" style="color:#ffffff;font-size:14px;">
                              Size
                            </th>

                            <th align="right" style="color:#ffffff;font-size:14px;">
                              Price
                            </th>

                            <th align="center" style="color:#ffffff;font-size:14px;">
                              Quantity
                            </th>

                            <th align="right" style="color:#ffffff;font-size:14px;">
                              Total
                            </th>

                          </tr>

                          ${products}

                        </table>
                        
                        <!-- Price Summary -->
                        <table width="100%" cellpadding="10" cellspacing="0" border="0" style="margin-top:20px;">
                          <tr>
                            <td align="right" style="color:#555555;font-size:15px;"> Subtotal: </td>
                            <td align="right" style="color:#333333;font-size:15px;width:120px;"> ₹${finalData.subtotal} </td>
                          </tr>
                          <tr>
                            <td align="right" style="color:#555555;font-size:15px;"> Shipping: </td>
                            <td align="right" style="color:#333333;font-size:15px;"> ₹${finalData.shipping} </td>
                          </tr>
                          <tr>
                            <td align="right" style="padding-top:12px;color:#222222;font-size:18px;font-weight:bold;"> Total:
                            </td>
                            <td align="right" style="padding-top:12px;color:#0d6efd;font-size:18px;font-weight:bold;"> ₹${finalData.total}
                            </td>
                          </tr>
                        </table> <!-- Delivery Address -->
                        <h3 style="margin:30px 0 12px;color:#222222;font-size:18px;"> Delivery Address </h3>
                        <div style="background:#f8f9fa;border-left:4px solid #0d6efd;padding:16px;">
                          <p style="margin:0;color:#555555;font-size:15px;line-height:25px;"> ${finalData.deliveryAddress?.name}<br>
                          ${finalData.deliveryAddress?.email}<br> ${finalData.deliveryAddress?.address}<br>  ${finalData.deliveryAddress?.city},  ${finalData.deliveryAddress?.state} -  ${finalData.deliveryAddress?.pin}<br> Phone:
                            ${finalData.deliveryAddress?.phone} </p>
                        </div> <!-- View Order Button -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:30px;">
                          <tr>
                            <td align="center">
                              <table cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td align="center" bgcolor="#0d6efd" style="border-radius:6px;"> <a
                                      href="${process.env.SITE_URL}/admin"
                                      style="display:inline-block;width:260px;padding:18px 0;background:#0d6efd;color:#ffffff;text-decoration:none;font-size:18px;font-weight:bold;text-align:center;border-radius:6px;">
                                      View Your Order </a> </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr> <!-- Footer -->
                    <tr>
                      <td align="center" style="background:#f8f9fa;padding:22px;border-top:1px solid #e5e5e5;">
                        <p style="margin:0;color:#666666;font-size:14px;"> ${process.env.SITE_NAME} Admin Notification </p>
                        <p style="margin:8px 0 0;color:#999999;font-size:12px;"> This is an automated notification for a new
                          order. </p>
                      </td>

                    </tr>
                  </table>
                </td>
              </tr>
            </table>
        `
    })

  } catch (error) {
    console.log(error)
    let errorMessage = Object.fromEntries(Object.keys(error.errors).map(key => [key, error.errors[key].message]))
    res.status(Object.values(errorMessage).length !== 0 ? 400 : 500).send({
      result: "Fail",
      reason: Object.values(errorMessage).length !== 0 ? errorMessage : "Internal Server Error"
    })
  }
}
async function getRecord(req, res) {
  try {
    let data = await Checkout.find().sort({ _id: -1 })
      .populate("user", ["name", "username"])
      .populate({
        path: "products.product",
        select: "name brand stockQuantity finalPrice pic",
        populate: {
          path: "brand",
          select: "-_id name"
        },
        options: {
          slice: {
            pic: 1
          }
        }
      })
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
async function getUserRecord(req, res) {
  try {
    let data = await Checkout.find({ user: req.params.user }).sort({ _id: -1 })
      .populate("user", ["name", "username"])
      .populate({
        path: "products.product",
        select: "name brand stockQuantity finalPrice pic",
        populate: {
          path: "brand",
          select: "-_id name"
        },
        options: {
          slice: {
            pic: 1
          }
        }
      })
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
    let data = await Checkout.findOne({ _id: req.params._id })
      .populate("user", ["name", "username"])
      .populate({
        path: "products.product",
        select: "name brand stockQuantity finalPrice pic",
        populate: {
          path: "brand",
          select: "-_id name"
        },
        options: {
          slice: {
            pic: 1
          }
        }
      })
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
    let data = await Checkout.findOne({ _id: req.params._id })
      .populate("user", ["name", "username"])
      .populate({
        path: "products.product",
        select: "name brand stockQuantity finalPrice pic",
        populate: {
          path: "brand",
          select: "-_id name"
        },
        options: {
          slice: {
            pic: 1
          }
        }
      })
    if (data) {
      data.paymentMode = req.body.paymentMode ?? data.paymentMode
      data.paymentStatus = req.body.paymentStatus ?? data.paymentStatus
      data.orderStatus = req.body.orderStatus ?? data.orderStatus
      data.rppid = req.body.rppid ?? data.rppid
      data.total = req.body.total ?? data.total
      await data.save()
      res.send({
        result: "Done",
        data: data
      })
      mailer.sendMail({
        from: process.env.MAIL_USERNAME,
        to: data.deliveryAddress?.email,
        subject: `Order Status Updated :Team ${process.env.SITE_NAME}`,
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
                          Order Status Update
                        </p>

                      </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                      <td style="padding:35px;">

                        <h2 style="margin:0 0 20px;color:#222222;font-size:23px;">
                          Hello ${data.deliveryAddress?.name},
                        </h2>

                        <p style="margin:0 0 20px;color:#555555;font-size:16px;line-height:27px;">
                          We wanted to let you know that the status of your
                          <strong>${process.env.SITE_NAME}</strong> order has been updated.
                        </p>

                        <!-- Status -->
                        <table width="100%" cellpadding="18" cellspacing="0" border="0"
                          style="background:#eaf8f0;border-left:4px solid #28a745;margin:25px 0;">

                          <tr>
                            <td style="color:#333333;font-size:16px;line-height:25px;">

                              <strong style="color:#28a745;font-size:18px;">
                                Order Status: ${data.orderStatus}
                              </strong>
                            </td>
                          </tr>

                        </table>

                        <!-- Order Details -->
                        <h3 style="margin:0 0 15px;color:#222222;font-size:18px;">
                          Order Details
                        </h3>

                        <table width="100%" cellpadding="12" cellspacing="0" border="0"
                          style="border:1px solid #e5e5e5;border-collapse:collapse;margin-bottom:25px;">

                          <tr style="background:#f8f9fa;">
                            <td style="font-weight:bold;color:#333333;width:170px;">
                              Order ID
                            </td>

                            <td style="color:#555555;">
                              ${data._id}
                            </td>
                          </tr>

                          <tr>
                            <td style="font-weight:bold;color:#333333;">
                              Order Date
                            </td>

                            <td style="color:#555555;">
                              ${data.createdAt?.toLocaleString()}
                            </td>
                          </tr>

                          <tr style="background:#f8f9fa;">
                            <td style="font-weight:bold;color:#333333;">
                              Updated On
                            </td>

                            <td style="color:#555555;">
                              ${data.updatedAt?.toLocaleString()}
                            </td>
                          </tr>

                          <tr>
                            <td style="font-weight:bold;color:#333333;">
                              Current Status
                            </td>

                            <td style="color:#28a745;font-weight:bold;">
                              ${data.orderStatus}
                            </td>
                          </tr>

                        </table>

                        <!-- View Order Button -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:30px;">

                          <tr>
                            <td align="center">

                              <table cellpadding="0" cellspacing="0" border="0">
                                <tr>

                                  <td align="center" bgcolor="#0d6efd" style="border-radius:6px;">

                                    <a href="${process.env.SITE_URL}?Optins=Order"
                                      style="display:inline-block;width:260px;padding:18px 0;background:#0d6efd;color:#ffffff;text-decoration:none;font-size:18px;font-weight:bold;text-align:center;border-radius:6px;">
                                      View Your Order
                                    </a>

                                  </td>

                                </tr>
                              </table>

                            </td>
                          </tr>

                        </table>

                        <p style="margin:30px 0 0;color:#555555;font-size:15px;line-height:26px;">
                          Thank you for choosing
                          <strong>${process.env.SITE_NAME}</strong>.
                          We appreciate your business and will keep you informed about further updates.
                        </p>

                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td align="center" style="background:#f8f9fa;padding:22px;border-top:1px solid #e5e5e5;">

                        <p style="margin:0;color:#666666;font-size:14px;">
                          Thank you for shopping with ${process.env.SITE_NAME}!
                        </p>

                        <p style="margin:8px 0 0;color:#999999;font-size:12px;">
                          © 2026 ${process.env.SITE_NAME}. All Rights Reserved.
                          <br>
                          ${process.env.SITE_URL}
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
      res.status(404).send({
        result: "Fail",
        reason: "No Such Exist"
      })
    }
  } catch (error) {
    let errorMessage = Object.fromEntries(Object.keys(error.errors).map(key => [key, error.errors[key].message]))
    res.status(Object.values(errorMessage).length !== 0 ? 400 : 500).send({
      result: "Fail",
      reason: Object.values(errorMessage).length !== 0 ? errorMessage : "Internal Server Error"
    })
  }

}

async function deleteRecord(req, res) {
  try {
    let data = await Checkout.findOne({ _id: req.params._id })
    if (data) {
      await data.deleteOne()
    }
    res.send({
      result: "Done"
    })
  } catch (error) {
    let errorMessage = error.keyValue ? Object.fromEntries(Object.keys(error.keyValue).map(key => [key, `Checkout with this name is Already Exist`])) : Object.fromEntries(Object.keys(error.errors).map(key => [key, error.errors[key].message]))
    res.status(Object.values(errorMessage).length !== 0 ? 400 : 500).send({
      result: "Fail",
      reason: Object.values(errorMessage).length !== 0 ? errorMessage : "Internal Server Error"
    })
  }
}


module.exports = {
  createRecord,
  getRecord,
  getUserRecord,
  getSingleRecord,
  updateRecord,
  deleteRecord,
  order,
  verifyOrder
}