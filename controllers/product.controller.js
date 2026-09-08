const Product = require("../models/product.model")
const Newsletter = require("../models/newsletter.model")
const fs = require('fs')
const mailer = require("../helper/mailer.helper")

async function createRecord(req, res) {
  try {
    let data = new Product(req.body)
    if (req.files)
      data.pic = Array.from(req.files).map(x => x.path)
    await data.save()
    let finalData = await Product.findOne({ _id: data._id })
      .populate("maincategory", ["name"])
      .populate("subcategory", ["name"])
      .populate("brand", ["name"])
    res.send({
      result: "Done",
      data: finalData
    })

    let newsletter = await Newsletter.find({ status: true })
    newsletter.forEach((x) => {
      mailer.sendMail({
        from: process.env.MAIL_USERNAME,
        to: x?.email,
        subject: `New Product Available :Team ${process.env.SITE_NAME}`,
        html: `
              <table width="600" cellpadding="0" cellspacing="0" border="0"
                 style="background:#ffffff;border:1px solid #e1e5ea;border-radius:12px;overflow:hidden;">
                 <!-- Header -->
                  <tr>
                    <td align="center" style="background:#0d6efd;padding:32px 25px;">

                      <h1 style="margin:0;color:#ffffff;font-size:30px;font-weight:bold;letter-spacing:0.5px;">
                        ${process.env.SITE_NAME}
                      </h1>

                      <p style="margin:10px 0 0;color:#dbe9ff;font-size:15px;">
                        ✨ Something New Has Arrived!
                      </p>

                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding:35px 32px;">

                      <h2 style="margin:0 0 15px;color:#222222;font-size:24px;font-weight:bold;">
                        Hey Our Valuable Customer! 👋
                      </h2>

                      <p style="margin:0 0 25px;color:#555555;font-size:16px;line-height:27px;">
                        We're excited to introduce a brand-new product at
                        <strong>${process.env.SITE_NAME}</strong>.
                        Be among the first to discover it!
                      </p>

                      <!-- Product Card -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0"
                        style="border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;background:#ffffff;">

                        <!-- Product Image -->
                        <tr>
                          <td align="center" style="padding:15px;background:#f8f9fa;">

                            <img
                              src="${process.env.SITE_URL}/${finalData.pic[0]}"
                              alt="${finalData.name}"
                              width="500"
                              style="display:block;width:100%;max-width:500px;height:auto;border-radius:8px;"
                            >

                          </td>
                        </tr>

                        <!-- Product Information -->
                        <tr>
                          <td style="padding:25px 20px;text-align:center;">

                            <h2 style="margin:0 0 10px;color:#222222;font-size:22px;font-weight:bold;">
                              ${finalData.name}
                            </h2>

                            <p style="margin:0 0 20px;color:#666666;font-size:15px;line-height:24px;">
                              ${finalData.description}
                            </p>

                            <!-- Discount Badge -->
                            <table cellpadding="0" cellspacing="0" border="0" align="center"
                              style="margin-bottom:18px;">

                              <tr>
                                <td align="center"
                                  style="background:#eaf8f0;color:#198754;padding:8px 16px;border-radius:20px;font-size:14px;font-weight:bold;">

                                  ${finalData.discount}% OFF · LIMITED TIME

                                </td>
                              </tr>

                            </table>

                            <!-- Price -->
                            <table cellpadding="0" cellspacing="0" border="0" align="center">

                              <tr>

                                <td style="padding-right:10px;color:#999999;font-size:17px;">
                                  <del>₹${finalData.basePrice}</del>
                                </td>

                                <td style="color:#0d6efd;font-size:27px;font-weight:bold;">
                                  ₹${finalData.finalPrice}
                                </td>

                              </tr>

                            </table>

                            <p style="margin:8px 0 0;color:#28a745;font-size:13px;font-weight:bold;">
                              You save ₹${finalData.basePrice - finalData.finalPrice}
                            </p>

                          </td>
                        </tr>

                        <!-- CTA -->
                        <tr>
                          <td align="center" style="padding:0 20px 28px;">

                            <table cellpadding="0" cellspacing="0" border="0">
                              <tr>

                                <td align="center"
                                  style="background:#0d6efd;border-radius:7px;">

                                  <a
                                    href="${process.env.SITE_URL}/product/${finalData._id}"
                                    style="display:inline-block;padding:15px 45px;color:#ffffff;text-decoration:none;font-size:17px;font-weight:bold;border-radius:7px;">
                                    View &amp; Shop Now
                                  </a>

                                </td>

                              </tr>
                            </table>

                          </td>
                        </tr>

                      </table>

                      <!-- Message -->
                      <table width="100%" cellpadding="15" cellspacing="0" border="0"
                        style="background:#f8f9fa;border-left:4px solid #0d6efd;margin-top:28px;">

                        <tr>
                          <td style="color:#555555;font-size:14px;line-height:24px;">

                            <strong style="color:#222222;">
                              Don't miss out!
                            </strong>
                            <br>

                            Explore our latest arrival before it goes out of stock.
                            Shop now and enjoy a seamless shopping experience with
                            <strong>${process.env.SITE_NAME}</strong>.

                          </td>
                        </tr>

                      </table>

                      <!-- Newsletter Notice -->
                      <p style="margin:28px 0 0;color:#888888;font-size:12px;line-height:20px;text-align:center;">
                        You're receiving this email because you subscribed to the
                        ${process.env.SITE_NAME} newsletter.
                      </p>

                    </td>
                  </tr>

                  <!-- Footer -->
                   <tr>
                    <td align="center"
                      style="background:#f8f9fa;padding:28px 20px;border-top:1px solid #e5e5e5;">

                      <p style="margin:0 0 15px;color:#555555;font-size:14px;font-weight:bold;">
                        Thank you for being a part of ${process.env.SITE_NAME}!
                      </p>

                      <p style="margin:0 0 18px;color:#888888;font-size:12px;line-height:20px;">
                        You're receiving this email because you subscribed to our newsletter.
                      </p>

                      <a href="${process.env.SITE_URL}/unsubscribe/${x._id}"
                        style="color:#0d6efd;text-decoration:none;font-size:13px;font-weight:bold;">
                        Unsubscribe from Newsletter
                      </a>

                      <p style="margin:20px 0 0;color:#999999;font-size:12px;line-height:20px;">
                        © 2026 ${process.env.SITE_NAME}. All Rights Reserved.
                        <br>
                        ${process.env.SITE_URL}
                      </p>

                    </td>
                  </tr>

              </table>

      `
      })
    })

  } catch (error) {
    if (req.files) {
      Array.from(req.files).forEach(x => {
        try {
          fs.unlinkSync(x.path)
        } catch (error) { }
      })
    }

    let errorMessage = Object.fromEntries(Object.keys(error.errors).map(key => [key, error.errors[key].message]))
    res.status(Object.values(errorMessage).length !== 0 ? 400 : 500).send({
      result: "Fail",
      reason: Object.values(errorMessage).length !== 0 ? errorMessage : "Internal Server Error"
    })
  }
}
async function getRecord(req, res) {
  try {
    let data = await Product.find()
      .sort({ _id: -1 })
      .populate("maincategory", ["name"])
      .populate("subcategory", ["name"])
      .populate("brand", ["name"])
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
    let data = await Product.findOne({ _id: req.params._id })
      .populate("maincategory", ["name"])
      .populate("subcategory", ["name"])
      .populate("brand", ["name"])
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
    let data = await Product.findOne({ _id: req.params._id })
    if (data) {
      data.name = req.body?.name ?? data.name
      data.maincategory = req.body?.maincategory ?? data.maincategory
      data.subcategory = req.body?.subcategory ?? data.subcategory
      data.brand = req.body?.brand ?? data.brand
      data.color = req.body?.color ?? data.color
      data.size = req.body?.size ?? data.size
      data.basePrice = req.body?.basePrice ?? data.basePrice
      data.discount = req.body?.discount ?? data.discount
      data.finalPrice = req.body?.finalPrice ?? data.finalPrice
      data.description = req.body?.description ?? data.description
      data.stock = req.body?.stock ?? data.stock
      data.stockQuantity = req.body?.stockQuantity ?? data.stockQuantity
      data.status = req.body?.status ?? data.status

      if (await data.save()) {
        if (req.body?.oldPics && req.body?.oldPics.length) {

          data.pic?.forEach((x) => {
            if (!req.body?.oldPics?.includes(x)) {
              try {
                fs.unlinkSync(x)
              } catch (error) { }
            }
          })
          data.pic = req.body?.oldPics
        }
        else {
          data.pic?.forEach((x) => {
            try {
              fs.unlinkSync(x)
            } catch (error) { }
          })

          data.pic = []
        }
        if (req.files && req.files?.length !== 0) {
          data.pic = data.pic.concat(Array.from(req.files).map(x => x.path))
        }
        await data.save()
      }

      let finalData = await Product.findOne({ _id: data._id })
        .populate("maincategory", ["name"])
        .populate("subcategory", ["name"])
        .populate("brand", ["name"])
      res.send({
        result: "Done",
        data: finalData
      })
    }
    else {
      res.status(404).send({
        result: "Fail",
        reason: "No Such Exist"
      })
    }
  } catch (error) {
    if (req.files) {
      Array.from(req.files).forEach(x => {
        try {
          fs.unlinkSync(x.path)
        } catch (error) { }
      })
    }

    let errorMessage = Object.fromEntries(Object.keys(error.errors).map(key => [key, error.errors[key].message]))
    res.status(Object.values(errorMessage).length !== 0 ? 400 : 500).send({
      result: "Fail",
      reason: Object.values(errorMessage).length !== 0 ? errorMessage : "Internal Server Error"
    })
  }

}

async function updateRecordByUser(req, res) {
  try {
    let data = await Product.findOne({ _id: req.params._id })
    if (data) {
      data.stock = req.body?.stock ?? data.stock
      data.stockQuantity = req.body?.stockQuantity ?? data.stockQuantity
    
      await data.save()
      let finalData = await Product.findOne({ _id: data._id })
        .populate("maincategory", ["name"])
        .populate("subcategory", ["name"])
        .populate("brand", ["name"])
      res.send({
        result: "Done",
        data: finalData
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
    let data = await Product.findOne({ _id: req.params._id })
    if (data) {
      data.pic?.forEach(x => {
        try {
          fs.unlinkSync(x)
        } catch (error) { }
      })


      await data.deleteOne()
    }
    res.send({
      result: "Done"
    })
  } catch (error) {
    let errorMessage = error.keyValue ? Object.fromEntries(Object.keys(error.keyValue).map(key => [key, `Product with this name is Already Exist`])) : Object.fromEntries(Object.keys(error.errors).map(key => [key, error.errors[key].message]))
    res.status(Object.values(errorMessage).length !== 0 ? 400 : 500).send({
      result: "Fail",
      reason: Object.values(errorMessage).length !== 0 ? errorMessage : "Internal Server Error"
    })
  }
}


module.exports = {
  createRecord,
  getRecord,
  getSingleRecord,
  updateRecord,
  updateRecordByUser,
  deleteRecord
}