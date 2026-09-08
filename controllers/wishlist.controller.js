const Wishlist = require("../models/wishlist.model")


async function createRecord(req, res) {
  try {
    let data = new Wishlist(req.body)
    await data.save()
    let finalData = await Wishlist.findOne({ _id: data._id })
      .populate("user", ["name", "username"])
      .populate({
        path: "product",
        select: "name brand stockQuantity finalPrice pic color size",
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
  } catch (error) {
    let errorMessage = Object.fromEntries(Object.keys(error.errors).map(key => [key, error.errors[key].message]))
    res.status(Object.values(errorMessage).length !== 0 ? 400 : 500).send({
      result: "Fail",
      reason: Object.values(errorMessage).length !== 0 ? errorMessage : "Internal Server Error"
    })
  }
}
async function getRecord(req, res) {
  try {
    let data = await Wishlist.find({ user: req.params.user }).sort({ _id: -1 }).populate("user", ["name", "username"])
      .populate({
        path: "product",
        select: "name brand stockQuantity finalPrice pic color size",
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
    let data = await Wishlist.findOne({ _id: req.params._id }).populate("user", ["name", "username"])
      .populate({
        path: "product",
        select: "name brand stockQuantity finalPrice pic color size",
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
    let data = await Wishlist.findOne({ _id: req.params._id }).populate("user", ["name", "username"])
      .populate({
        path: "product",
        select: "name brand stockQuantity finalPrice pic color size",
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
    let errorMessage = Object.fromEntries(Object.keys(error.errors).map(key => [key, error.errors[key].message]))
    res.status(Object.values(errorMessage).length !== 0 ? 400 : 500).send({
      result: "Fail",
      reason: Object.values(errorMessage).length !== 0 ? errorMessage : "Internal Server Error"
    })
  }

}

async function deleteRecord(req, res) {
  try {
    let data = await Wishlist.findOne({ _id: req.params._id })
    if (data) {
      await data.deleteOne()
    }
    res.send({
      result: "Done"
    })
  } catch (error) {
    let errorMessage = error.keyValue ? Object.fromEntries(Object.keys(error.keyValue).map(key => [key, `Wishlist with this name is Already Exist`])) : Object.fromEntries(Object.keys(error.errors).map(key => [key, error.errors[key].message]))
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
  deleteRecord
}